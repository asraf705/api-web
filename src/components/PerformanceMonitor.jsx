import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceMonitor = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [performanceData, setPerformanceData] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [interval, setInterval] = useState(5000); // 5 seconds default

  const startMonitoring = () => {
    setIsMonitoring(true);
    monitorPerformance();
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const monitorPerformance = async () => {
    if (!isMonitoring) return;

    try {
      const startTime = performance.now();
      const response = await fetch(apiUrl);
      const endTime = performance.now();
      
      const newData = {
        timestamp: new Date().toLocaleTimeString(),
        responseTime: endTime - startTime,
        status: response.status
      };

      setPerformanceData(prev => [...prev.slice(-20), newData]); // Keep last 20 data points
      
      setTimeout(monitorPerformance, interval);
    } catch (error) {
      console.error('Monitoring error:', error);
      setIsMonitoring(false);
    }
  };

  const chartData = {
    labels: performanceData.map(d => d.timestamp),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: performanceData.map(d => d.responseTime),
        borderColor: '#0891b2',
        backgroundColor: 'rgba(8, 145, 178, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="performance-monitor">
      <div className="monitor-controls">
        <input
          type="url"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="Enter API URL to monitor"
          className="api-input"
        />
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          min="1000"
          step="1000"
          className="interval-input"
        />
        <button
          onClick={isMonitoring ? stopMonitoring : startMonitoring}
          className={`monitor-btn ${isMonitoring ? 'stop' : 'start'}`}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      <div className="performance-stats">
        <div className="stat-card">
          <h3>Average Response Time</h3>
          <div className="stat-value">
            {performanceData.length > 0
              ? `${(performanceData.reduce((acc, curr) => acc + curr.responseTime, 0) / performanceData.length).toFixed(2)} ms`
              : 'N/A'}
          </div>
        </div>
        <div className="stat-card">
          <h3>Latest Response Time</h3>
          <div className="stat-value">
            {performanceData.length > 0
              ? `${performanceData[performanceData.length - 1].responseTime.toFixed(2)} ms`
              : 'N/A'}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PerformanceMonitor;