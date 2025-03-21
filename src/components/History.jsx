import React, { useState } from 'react';
import './History.css';

const History = ({ history, favorites, onLoadRequest, onToggleFavorite, onClose }) => {
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <div className="history-page">
      <div className="history-header">
        <h2>Request History</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="history-tabs">
        <button 
          className={`tab ${!showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(false)}
        >
          History
        </button>
        <button 
          className={`tab ${showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(true)}
        >
          Favorites
        </button>
      </div>
      
      <div className="history-list">
        {(showFavorites ? favorites : history).map((item, index) => (
          <div key={index} className="history-item">
            <span className={`method ${item.method.toLowerCase()}`}>{item.method}</span>
            <span className="url">{item.url}</span>
            <span className="timestamp">
              {new Date(item.timestamp).toLocaleTimeString()}
            </span>
            <div className="history-actions">
              <button onClick={() => onLoadRequest(item)}>Load</button>
              <button 
                className={`favorite-btn ${favorites.some(fav => 
                  fav.url === item.url && fav.method === item.method
                ) ? 'active' : ''}`}
                onClick={() => onToggleFavorite(item)}
              >
                ★
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;