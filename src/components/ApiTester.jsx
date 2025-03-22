import React, { useState, useEffect } from 'react';
import './ApiTester.css';
import History from './History';
import LoadingOverlay from './LoadingOverlay';
import DataVisualization from './DataVisualization';
import Settings from './Settings';
import ApiTemplates from './ApiTemplates';
import Documentation from './Documentation';
import { saveLog } from '../utils/logUtils'; // Add this import


const ApiTester = () => {
  // Add this with other state declarations at the top
  const [showDocs, setShowDocs] = useState(false);


  // Add these state declarations at the top with other states
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('apiTesterSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      defaultMethod: 'GET',
      defaultHeaders: [{ key: 'Content-Type', value: 'application/json' }],
      theme: 'light',
      responseFormat: 'pretty',
      timeoutDuration: 30000,
      maxHistoryItems: 50,
      autoSaveHistory: true
    };
  });

  // Add useEffect for settings
  useEffect(() => {
    localStorage.setItem('apiTesterSettings', JSON.stringify(settings));
    // Apply theme
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  // Remove showFavorites state
  const [responseTime, setResponseTime] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);
  const [lastRequestHeaders, setLastRequestHeaders] = useState(null);  // Add this line
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('apiTesterHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('apiTesterFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const exportHistory = () => {
    const data = JSON.stringify({ history, favorites }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-tester-history.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add useEffect to save history and favorites to localStorage
  useEffect(() => {
    localStorage.setItem('apiTesterHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('apiTesterFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Update importHistory function
  const importHistory = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data) {
            // Update history and favorites in state and localStorage
            if (Array.isArray(data.history)) {
              setHistory(data.history);
              localStorage.setItem('apiTesterHistory', JSON.stringify(data.history));
            }
            
            if (Array.isArray(data.favorites)) {
              setFavorites(data.favorites);
              localStorage.setItem('apiTesterFavorites', JSON.stringify(data.favorites));
            }
            
            setNotification('History imported successfully');
            setTimeout(() => setNotification(null), 3000);
          }
        } catch (error) {
          console.error('Import error:', error);
          setNotification('Error: Invalid JSON file format');
          setTimeout(() => setNotification(null), 3000);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const toggleFavorite = (item) => {
    const isFavorite = favorites.some(fav => 
      fav.url === item.url && fav.method === item.method
    );
    
    if (isFavorite) {
      setFavorites(favorites.filter(fav => 
        fav.url !== item.url || fav.method !== item.method
      ));
    } else {
      setFavorites([...favorites, item]);
    }
  };

  // Add new state for error messages
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  // Add loadRequest function inside the component
  const loadRequest = (item) => {
    setUrl(item.url);
    setMethod(item.method);
    if (item.headers) {
      if (Array.isArray(item.headers)) {
        setHeaders(item.headers);
      } else {
        const headerArray = Object.entries(item.headers).map(([key, value]) => ({
          key,
          value
        }));
        setHeaders(headerArray.length > 0 ? headerArray : [{ key: '', value: '' }]);
      }
    } else {
      setHeaders([{ key: '', value: '' }]);
    }
    setBody(item.body || '');

    setNotification('Request loaded successfully');
    setTimeout(() => setNotification(null), 3000);
  };

  // Update handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state
    const startTime = performance.now();

    const requestHeaders = {};
    headers.forEach(header => {
      if (header.key && header.value) {
        requestHeaders[header.key] = header.value;
      }
    });
    setLastRequestHeaders(requestHeaders);

    try {
      // Validate URL before making request
      if (!url || !url.startsWith('http')) {
        throw new Error('Please enter a valid URL starting with http or https');
      }

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: method !== 'GET' ? body : undefined
      });

      const endTime = performance.now();
      setResponseTime(endTime - startTime);

      // Log successful request
      saveLog({
        type: 'request',
        status: 'success',
        url,
        method,
        headers: requestHeaders,
        body,
        responseTime: endTime - startTime,
        timestamp: new Date().toISOString()
      });

      const responseHeadersObj = {};
      response.headers.forEach((value, key) => {
        responseHeadersObj[key] = value;
      });
      setResponseHeaders(responseHeadersObj);
  
      // Check content type to handle different response formats
      const contentType = response.headers.get('content-type');
      let responseData;
  
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
  
      setResponse({
        status: response.status,
        data: typeof responseData === 'string' ? responseData : JSON.stringify(responseData, null, 2)
      });
  
      // Save to history
      setHistory(prev => [...prev, {
        url,
        method,
        headers: requestHeaders,
        body,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      const endTime = performance.now();
      setResponseTime(endTime - startTime);
      
      // Log error
      saveLog({
        type: 'request',
        status: 'error',
        url,
        method,
        headers: requestHeaders,
        body,
        error: error.message,
        responseTime: endTime - startTime,
        timestamp: new Date().toISOString()
      });

      setError(error.message);
      setResponse({
        status: 'Error',
        data: error.message || 'Failed to fetch'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add error display in the return statement
  return (
    <div className="api-tester">
      <LoadingOverlay isLoading={loading} />
      <div className="toolbar">
        
        <button type="button" className="toolbar-btn" onClick={exportHistory}>
          Export
        </button>
        <input
          type="file"
          accept=".json"
          onChange={importHistory}
          style={{ display: 'none' }}
          id="import-file"
        />
        <button type="button" className="toolbar-btn" onClick={() => document.getElementById('import-file').click()}>
          Import
        </button>
        <button 
          type="button" 
          className="history-btn toolbar-btn"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
        <button 
          type="button" 
          className="toolbar-btn"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </button>
        <button 
          type="button" 
          className="toolbar-btn"
          onClick={() => setShowDocs(!showDocs)}
        >
          {showDocs ? 'Hide Docs' : 'Documentation'}
        </button>
      </div>
      
      {/* Add Documentation component after toolbar and before form */}
      {showDocs && <Documentation onClose={() => setShowDocs(false)} />}

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onSave={(newSettings) => {
            setSettings(newSettings);
            // Apply settings
            setMethod(newSettings.defaultMethod);
            if (newSettings.defaultHeaders.length > 0) {
              setHeaders(newSettings.defaultHeaders);
            }
            document.documentElement.setAttribute('data-theme', newSettings.theme);
          }}
        />
      )}

      {showHistory && (
        <History
          history={[...history].reverse()}  // Reverse the history array to show latest first
          favorites={favorites}
          onLoadRequest={loadRequest}
          onToggleFavorite={toggleFavorite}
          onClose={() => setShowHistory(false)}
        />
      )}

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="url-container">
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>PATCH</option>
          </select>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter API URL"
            required
          />
        </div>

        <div className="headers-section">
          <h3>Headers</h3>
          {headers.map((header, index) => (
            <div key={index} className="header-row">
              <input
                type="text"
                placeholder="Header key"
                value={header.key}
                onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
              />
              <input
                type="text"
                placeholder="Header value"
                value={header.value}
                onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
              />
              <button type="button" onClick={() => removeHeader(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addHeader}>Add Header</button>
        </div>

        {method !== 'GET' && (
          <div className="body-section">
            <h3>Request Body</h3>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter request body (JSON)"
            />
          </div>
        )}

        {/* Update the submit button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Send Request'}
        </button>

        {/* Update the response time display */}
        {responseTime && (
          <div className={`response-time ${
            responseTime < 300 ? 'fast' : 
            responseTime < 1000 ? 'medium' : 'slow'
          }`}>
            Response Time: {responseTime.toFixed(2)}ms
            {responseTime < 300 ? ' (Fast)' : 
             responseTime < 1000 ? ' (Good)' : ' (Slow)'}
          </div>
        )}
      </form>

      {response && (
        <div className="response-section">
          <div className="response-header">
            <h3>Response</h3>
            <button 
              type="button" 
              className="export-response-btn"
              onClick={() => {
                const exportData = {
                  url,
                  method,
                  headers: lastRequestHeaders,
                  body,
                  response: {
                    status: response.status,
                    headers: responseHeaders,
                    // Safely parse the response data
                    data: typeof response.data === 'string' ? 
                      (response.data.startsWith('{') || response.data.startsWith('[') ? 
                        JSON.parse(response.data) : response.data) : 
                      response.data,
                    responseTime: responseTime
                  },
                  timestamp: new Date().toISOString()
                };
                
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `api-response-${new Date().getTime()}.json`;
                a.click();
                URL.revokeObjectURL(downloadUrl);
              }}
            >
              Export Response
            </button>
          </div>
          <div className="status">Status: {response.status}</div>
          {responseTime && (
            <div className="response-time">
              Response Time: {responseTime.toFixed(2)}ms
            </div>
          )}
          {responseHeaders && (
            <div className="response-headers">
              <h4>Response Headers</h4>
              <pre>{JSON.stringify(responseHeaders, null, 2)}</pre>
            </div>
          )}
          <pre>{response.data}</pre>
          <div className="visualization-section">
            <h3>Data Visualization</h3>
            <DataVisualization apiData={
              typeof response.data === 'string' ? 
                (response.data.startsWith('{') || response.data.startsWith('[') ? 
                  JSON.parse(response.data) : null) : 
              response.data
            } 
          />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTester;