// client/src/components/PlumbingVisualizer.jsx

import { useState, useEffect } from "react";
import { useRequestLog, clearRequestLog } from "./RequestLogger";
import {
  Activity,
  X,
  Trash2,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export function PlumbingVisualizer() {
  const [isVisible, setIsVisible] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all"); // all, success, error

  useEffect(() => {
    const cleanup = useRequestLog((logs) => {
      setRequests(logs.slice(-20)); // Keep last 20
    });

    return cleanup;
  }, []);

  // Keyboard shortcut: Ctrl+Shift+P
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="plumbing-toggle-btn"
        title="Open Request Visualizer (Ctrl+Shift+P)"
      >
        <Activity size={20} />
      </button>
    );
  }

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  return (
    <div className="plumbing-visualizer">
      {/* Header */}
      <div className="plumbing-header">
        <Activity size={16} />
        <span>REQUEST PLUMBING</span>
        <div className="plumbing-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="plumbing-filter"
          >
            <option value="all">ALL ({requests.length})</option>
            <option value="success">
              SUCCESS ({requests.filter((r) => r.status === "success").length})
            </option>
            <option value="error">
              ERROR ({requests.filter((r) => r.status === "error").length})
            </option>
          </select>
          <button onClick={clearRequestLog} title="Clear logs">
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            title="Close (Ctrl+Shift+P)"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Request List */}
      <div className="plumbing-body">
        {filteredRequests.length === 0 ? (
          <div className="plumbing-empty">
            No requests yet. Interact with your app to see the plumbing in
            action!
          </div>
        ) : (
          filteredRequests.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))
        )}
      </div>
    </div>
  );
}

function RequestCard({ request }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = () => {
    if (request.status === "pending")
      return <Clock size={14} className="pending-icon" />;
    if (request.status === "success")
      return <CheckCircle size={14} className="success-icon" />;
    return <XCircle size={14} className="error-icon" />;
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: "#10b981",
      POST: "#3b82f6",
      PATCH: "#f59e0b",
      PUT: "#8b5cf6",
      DELETE: "#ef4444",
    };
    return colors[method] || "#6b7280";
  };

  return (
    <div
      className={`request-card ${request.status}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="request-card-main">
        <div className="request-flow">
          <span
            className="request-method"
            style={{ color: getMethodColor(request.method) }}
          >
            {request.method}
          </span>
          <ArrowRight size={12} className="flow-arrow" />
          <span className="request-url">{request.url}</span>
        </div>

        <div className="request-meta">
          {getStatusIcon()}
          {request.statusCode && (
            <span className="status-code">{request.statusCode}</span>
          )}
          {request.duration !== null && (
            <span className="duration">{request.duration}ms</span>
          )}
          <span className="timestamp">
            {request.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="request-details">
          <div className="detail-row">
            <strong>Full URL:</strong> {request.url}
          </div>
          <div className="detail-row">
            <strong>Time:</strong> {request.timestamp.toLocaleString()}
          </div>
          {request.duration !== null && (
            <div className="detail-row">
              <strong>Duration:</strong> {request.duration}ms
            </div>
          )}
          {request.error && (
            <div className="detail-row error-detail">
              <strong>Error:</strong> {request.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
