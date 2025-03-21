import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <svg className="loading-spinner" viewBox="25 25 50 50">
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="4"
            strokeMiterlimit="10"
          />
        </svg>
        <span className="loading-text">Processing Request...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;