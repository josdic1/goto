// client/src/components/RequestLogger.jsx

let requestLog = [];
let listeners = [];

// Intercept fetch globally
const originalFetch = window.fetch;

window.fetch = function(...args) {
  const [url, options] = args;
  const startTime = Date.now();
  
  const logEntry = {
    id: Date.now() + Math.random(),
    type: 'request',
    method: options?.method || 'GET',
    url: url,
    timestamp: new Date(),
    status: 'pending',
    duration: null
  };
  
  requestLog.push(logEntry);
  notifyListeners();
  
  return originalFetch(...args)
    .then(async (response) => {
      const duration = Date.now() - startTime;
      
      logEntry.type = 'response';
      logEntry.status = response.ok ? 'success' : 'error';
      logEntry.statusCode = response.status;
      logEntry.duration = duration;
      
      notifyListeners();
      return response;
    })
    .catch((error) => {
      logEntry.type = 'response';
      logEntry.status = 'error';
      logEntry.error = error.message;
      logEntry.duration = Date.now() - startTime;
      
      notifyListeners();
      throw error;
    });
};

function notifyListeners() {
  listeners.forEach(callback => callback([...requestLog]));
}

export function useRequestLog(callback) {
  listeners.push(callback);
  
  // Return cleanup function
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
}

export function clearRequestLog() {
  requestLog = [];
  notifyListeners();
}