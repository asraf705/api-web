import React, { useState } from 'react';
import './Documentation.css';

const Documentation = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const docs = {
    'getting-started': {
      icon: '📚',
      title: 'Getting Started',
      content: [
        {
          title: 'Quick Start Guide',
          text: '1. Enter your API endpoint URL\n2. Select HTTP method (GET, POST, etc.)\n3. Add any required headers\n4. For POST/PUT, enter request body\n5. Click "Send Request" to test'
        },
        {
          title: 'Basic Configuration',
          text: 'Configure default settings like:\n• Default HTTP method\n• Common headers\n• Response format preferences\n• Theme selection'
        }
      ]
    },
    'features': {
      icon: '⚡',
      title: 'Key Features',
      content: [
        {
          title: 'API Management',
          text: '• History tracking of all requests\n• Favorite requests for quick access\n• Import/Export functionality\n• Response time monitoring'
        },
        {
          title: 'Data Handling',
          text: '• Automatic JSON formatting\n• Visual data representation\n• Response headers analysis\n• Error handling and display'
        }
      ]
    },
    'performance': {
      icon: '📊',
      title: 'Performance Monitoring',
      content: [
        {
          title: 'Real-Time Metrics',
          text: '• Response Time Tracking\n• Error Rate Analysis\n• Request Success Rate\n• Performance Trends\n• Historical Data Analysis'
        },
        {
          title: 'Performance Features',
          text: '• Set custom performance thresholds\n• Visual performance graphs\n• Response time alerts\n• Export performance data\n• Performance optimization tips'
        }
      ]
    },
    'tips': {
      icon: '💡',
      title: 'Pro Tips',
      content: [
        {
          title: 'Best Practices',
          text: '• Use templates for common APIs\n• Save frequently used requests\n• Monitor response times\n• Validate JSON before sending'
        },
        {
          title: 'Keyboard Shortcuts',
          text: '• Ctrl + Enter: Send request\n• Ctrl + S: Save to favorites\n• Ctrl + H: Toggle history\n• Esc: Close current panel'
        }
      ]
    },
    'troubleshooting': {
      icon: '🔧',
      title: 'Troubleshooting',
      content: [
        {
          title: 'Common Issues',
          text: '• CORS errors: Enable CORS or use a proxy\n• Authentication: Verify your tokens/keys\n• Timeout: Check network connection\n• Invalid JSON: Validate syntax'
        },
        {
          title: 'Error Messages',
          text: '• 4xx errors: Check request format\n• 5xx errors: Server-side issues\n• Network errors: Check connectivity\n• Parse errors: Validate data format'
        }
      ]
    }
  };

  return (
    <div className="documentation-overlay">
      <div className="documentation">
        <div className="documentation-header">
          <h2>API Tester Documentation</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="documentation-content">
          <div className="doc-sidebar">
            {Object.entries(docs).map(([key, section]) => (
              <button
                key={key}
                className={`doc-nav-item ${activeSection === key ? 'active' : ''}`}
                onClick={() => setActiveSection(key)}
              >
                <span className="doc-nav-icon">{section.icon}</span>
                <span className="doc-nav-text">{section.title}</span>
              </button>
            ))}
          </div>
          
          <div className="doc-content">
            <div className="doc-content-header">
              <span className="section-icon">{docs[activeSection].icon}</span>
              <h2>{docs[activeSection].title}</h2>
            </div>
            {docs[activeSection].content.map((item, index) => (
              <div key={index} className="doc-section">
                <h3>{item.title}</h3>
                <div className="doc-text">
                  {item.text.split('\n').map((text, i) => (
                    <p key={i}>{text}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;