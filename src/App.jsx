import React, { useState, useEffect } from 'react';
import './App.css';
import ApiTester from './components/ApiTester';
import SeoChecker from './components/SeoChecker';

function App() {
  const [activeTab, setActiveTab] = useState('api');

  // Add debugging logger
  useEffect(() => {
    console.log('Current active tab:', activeTab);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    console.log('Switching to tab:', tab);
    setActiveTab(tab);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Dev Tools</h1>
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => handleTabChange('api')}
          >
            API Tester
          </button>
          <button 
            className={`nav-item ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => handleTabChange('seo')}
          >
            SEO Checker
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'api' ? <ApiTester /> : <SeoChecker />}
      </main>

      <footer className="app-footer">
        <p>Dev Tools &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;