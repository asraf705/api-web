import React from 'react';
import ApiTester from './components/ApiTester';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>API Testing Tool</h1>
      </header>
      <main className="app-main">
        <ApiTester />
      </main>
      <footer className="app-footer">
        <p>API Testing Tool © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
