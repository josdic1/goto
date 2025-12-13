// client/src/components/DataFlowVisualizer.jsx

import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

let dataFlowLog = [];
let flowListeners = [];

// Intercept fetch to capture data flow
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const [url, options] = args;
  
  // Only track API calls
  if (!url.includes('/api/')) {
    return originalFetch(...args);
  }
  
  const flowEntry = {
    id: Date.now() + Math.random(),
    timestamp: new Date(),
    url: url,
    method: options?.method || 'GET',
    
    // FRONTEND: What we're sending
    frontendData: options?.body ? JSON.parse(options.body) : null,
    
    // IN FLIGHT: Request metadata
    status: 'pending',
    
    // BACKEND: Response (filled in later)
    backendResponse: null,
    responseStatus: null
  };
  
  dataFlowLog.push(flowEntry);
  notifyFlowListeners();
  
  return originalFetch(...args)
    .then(async (response) => {
      const clonedResponse = response.clone();
      
      try {
        const data = await clonedResponse.json();
        flowEntry.backendResponse = data;
      } catch (e) {
        flowEntry.backendResponse = { message: 'Non-JSON response' };
      }
      
      flowEntry.responseStatus = response.status;
      flowEntry.status = response.ok ? 'success' : 'error';
      
      notifyFlowListeners();
      return response;
    })
    .catch((error) => {
      flowEntry.status = 'error';
      flowEntry.backendResponse = { error: error.message };
      notifyFlowListeners();
      throw error;
    });
};

function notifyFlowListeners() {
  flowListeners.forEach(callback => callback([...dataFlowLog]));
}

export function useDataFlow(callback) {
  useEffect(() => {
    flowListeners.push(callback);
    return () => {
      flowListeners = flowListeners.filter(cb => cb !== callback);
    };
  }, [callback]);
}

export function clearDataFlow() {
  dataFlowLog = [];
  notifyFlowListeners();
}

export function DataFlowVisualizer() {
  const [isVisible, setIsVisible] = useState(false);
  const [flows, setFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);

  useDataFlow((newFlows) => {
    setFlows(newFlows.slice(-10)); // Keep last 10
    
    // Auto-select the most recent one
    if (newFlows.length > 0) {
      setSelectedFlow(newFlows[newFlows.length - 1]);
    }
  });

  // Keyboard shortcut: Ctrl+Shift+D (D for Data)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="dataflow-toggle-btn"
        title="Open Data Flow Visualizer (Ctrl+Shift+D)"
      >
        <Eye size={20} />
      </button>
    );
  }

  return (
    <div className="dataflow-visualizer">
      {/* Header */}
      <div className="dataflow-header">
        <Eye size={16} />
        <span>DATA FLOW TRACKER</span>
        <button onClick={() => setIsVisible(false)} title="Close (Ctrl+Shift+D)">
          <EyeOff size={14} />
        </button>
      </div>

      {/* Flow List (Mini) */}
      <div className="dataflow-list">
        {flows.map((flow) => (
          <button
            key={flow.id}
            onClick={() => setSelectedFlow(flow)}
            className={`flow-item ${selectedFlow?.id === flow.id ? 'active' : ''} ${flow.status}`}
          >
            <span className="flow-method">{flow.method}</span>
            <span className="flow-url">{flow.url.replace(/.*\/api/, '/api')}</span>
            <span className="flow-time">{flow.timestamp.toLocaleTimeString()}</span>
          </button>
        ))}
      </div>

      {/* Selected Flow Detail */}
      {selectedFlow ? (
        <FlowDetail flow={selectedFlow} />
      ) : (
        <div className="dataflow-empty">
          Make a request to see the data flow...
        </div>
      )}
    </div>
  );
}

function FlowDetail({ flow }) {
  return (
    <div className="flow-detail">
      {/* Three Column Layout */}
      <div className="flow-columns">
        
        {/* LEFT: Frontend */}
        <div className="flow-column frontend">
          <div className="column-header">
            <span>📝 FRONTEND</span>
            <small>What you sent</small>
          </div>
          <div className="column-body">
            {flow.frontendData ? (
              <pre>{JSON.stringify(flow.frontendData, null, 2)}</pre>
            ) : (
              <div className="empty-state">No request body (GET request)</div>
            )}
          </div>
        </div>

        {/* CENTER: In Flight */}
        <div className="flow-column inflight">
          <div className="column-header">
            <ArrowRight size={16} className={flow.status === 'pending' ? 'spinning' : ''} />
            <span>IN FLIGHT</span>
          </div>
          <div className="column-body transfer-info">
            <div className="transfer-row">
              <strong>Method:</strong> {flow.method}
            </div>
            <div className="transfer-row">
              <strong>Endpoint:</strong> {flow.url.replace(/.*\/api/, '/api')}
            </div>
            <div className="transfer-row">
              <strong>Status:</strong> 
              <span className={`status-badge ${flow.status}`}>
                {flow.status === 'pending' && '⏳ Sending...'}
                {flow.status === 'success' && `✓ ${flow.responseStatus}`}
                {flow.status === 'error' && `✗ ${flow.responseStatus || 'Failed'}`}
              </span>
            </div>
            <div className="transfer-row">
              <strong>Time:</strong> {flow.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* RIGHT: Backend */}
        <div className="flow-column backend">
          <div className="column-header">
            <span>💾 BACKEND</span>
            <small>Server response</small>
          </div>
          <div className="column-body">
            {flow.backendResponse ? (
              <pre>{JSON.stringify(flow.backendResponse, null, 2)}</pre>
            ) : (
              <div className="empty-state pending">Waiting for response...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}