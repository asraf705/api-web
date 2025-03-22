import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ onClose, onSave }) => {
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

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('apiTesterSettings', JSON.stringify(settings));
    onSave(settings);
    onClose();
  };

  return (
    <div className="settings-modal">
      <div className="settings-content">
        <h2>Settings</h2>
        
        <div className="settings-section">
          <h3>Default Request Settings</h3>
          <div className="setting-item">
            <label>Default Method</label>
            <select 
              value={settings.defaultMethod}
              onChange={(e) => handleChange('defaultMethod', e.target.value)}
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>PATCH</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Response Format</label>
            <select
              value={settings.responseFormat}
              onChange={(e) => handleChange('responseFormat', e.target.value)}
            >
              <option value="pretty">Pretty Print</option>
              <option value="compact">Compact</option>
              <option value="raw">Raw</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Request Timeout (ms)</label>
            <input
              type="number"
              value={settings.timeoutDuration}
              onChange={(e) => handleChange('timeoutDuration', parseInt(e.target.value))}
              min="1000"
              max="60000"
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>History Settings</h3>
          <div className="setting-item">
            <label>Max History Items</label>
            <input
              type="number"
              value={settings.maxHistoryItems}
              onChange={(e) => handleChange('maxHistoryItems', parseInt(e.target.value))}
              min="10"
              max="100"
            />
          </div>

          <div className="setting-item">
            <label>Auto-save History</label>
            <input
              type="checkbox"
              checked={settings.autoSaveHistory}
              onChange={(e) => handleChange('autoSaveHistory', e.target.checked)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Theme</h3>
          <div className="setting-item">
            <label>Theme Mode</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>

        <div className="settings-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave} className="save-btn">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;