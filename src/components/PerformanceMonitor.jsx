import React, { useState, useEffect, useCallback } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceMonitor = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [performanceData, setPerformanceData] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [intervalTime, setIntervalTime] = useState(5000);

  const fetchExtensionData = useCallback(async () => {
    if (!isMonitoring || !apiUrl) return;

    if (window.chrome && window.chrome.runtime) {
      window.chrome.runtime.sendMessage({ type: 'getPerformanceData' }, (response) => {
      if (response && response.performanceData && response.performanceData[apiUrl]) {
        const data = response.performanceData[apiUrl];
        const newPerformanceData = data.timestamps.map((timestamp, index) => ({
          timestamp: new Date(timestamp).toLocaleTimeString(),
          responseTime: data.responseTimes[index],
          status: data.statusCodes[index]
        }));
        setPerformanceData(newPerformanceData);
      }
    });

    if (isMonitoring) {
      setTimeout(fetchExtensionData, intervalTime);
    }
    }
  }, [isMonitoring, apiUrl, intervalTime]);

  useEffect(() => {
    if (isMonitoring) {
      fetchExtensionData();
    }
  }, [isMonitoring, fetchExtensionData]);
  const [errorCount, setErrorCount] = useState(0);
  const [statusCodes, setStatusCodes] = useState({});

  const calculateStats = useCallback(() => {
    const stats = {
      totalRequests: performanceData.length,
      successRate: 0,
      avgResponse: 0,
      statusDistribution: {}
    };

    if (performanceData.length > 0) {
      const successfulRequests = performanceData.filter(
        d => d.status >= 200 && d.status < 400
      ).length;
      
      stats.successRate = (successfulRequests / performanceData.length) * 100;
      stats.avgResponse = performanceData.reduce(
        (acc, curr) => acc + curr.responseTime, 0
      ) / performanceData.length;
      
      // Calculate status code distribution
      const statusCounts = performanceData.reduce((acc, curr) => {
        const statusGroup = `${Math.floor(curr.status / 100)}xx`;
        acc[statusGroup] = (acc[statusGroup] || 0) + 1;
        return acc;
      }, {});
      
      stats.statusDistribution = statusCounts;
    }

    return stats;
  }, [performanceData]);

  const monitorPerformance = useCallback(async () => {
    if (!isMonitoring || !apiUrl) return;

    try {
      const startTime = performance.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiUrl, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      const newData = {
        timestamp: new Date().toLocaleTimeString(),
        responseTime,
        status: response.status
      };

      setPerformanceData(prev => [...prev.slice(-29), newData]);
      setStatusCodes(prev => ({
        ...prev,
        [response.status]: (prev[response.status] || 0) + 1
      }));

    } catch (error) {
      setErrorCount(prev => prev + 1);
      const newData = {
        timestamp: new Date().toLocaleTimeString(),
        responseTime: 0,
        status: error.name === 'AbortError' ? 504 : 500
      };
      setPerformanceData(prev => [...prev.slice(-29), newData]);
    } finally {
      if (isMonitoring) {
        setTimeout(monitorPerformance, intervalTime);
      }
    }
  }, [isMonitoring, apiUrl, intervalTime]);

  useEffect(() => {
    if (isMonitoring) {
      monitorPerformance();
    }
  }, [isMonitoring, monitorPerformance]);

  const stats = calculateStats();
  
  // Enhanced Chart Configurations
  const responseTimeChart = {
    labels: performanceData.map(d => d.timestamp),
    datasets: [{
      label: 'Response Time (ms)',
      data: performanceData.map(d => d.responseTime),
      borderColor: '#0891b2',
      backgroundColor: 'rgba(8, 145, 178, 0.1)',
      fill: true,
      tension: 0.3
    }]
  };

  const statusCodeChart = {
    labels: Object.keys(statusCodes),
    datasets: [{
      label: 'Status Code Distribution',
      data: Object.values(statusCodes),
      backgroundColor: [
        '#059669', // 2xx
        '#2563eb', // 3xx
        '#d97706', // 4xx
        '#dc2626'  // 5xx
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true,
        text: 'Performance Metrics',
        padding: { bottom: 20 }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: { 
        grid: { display: false },
        ticks: { maxRotation: 0 }
      }
    }
  };

  return (
    <div className="performance-monitor extension">
      <div className="monitor-controls">
        <div className="input-group">
          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Enter API endpoint URL"
            className="api-input"
          />
          <div className="input-hint">Valid HTTP/HTTPS URL required</div>
        </div>
        
        <div className="input-group">
          <input
            type="number"
            value={intervalTime}
            onChange={(e) => setIntervalTime(Math.max(1000, e.target.value))}
            min="1000"
            step="1000"
            className="interval-input"
          />
          <div className="input-hint">Refresh interval (ms)</div>
        </div>

        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`monitor-btn ${isMonitoring ? 'stop' : 'start'}`}
        >
          {isMonitoring ? '⏹ Stop Monitoring' : '▶ Start Monitoring'}
        </button>
      </div>

      <div className="performance-stats">
        <div className="stat-card">
          <h3>Requests</h3>
          <div className="stat-value">
            {stats.totalRequests}
            <span className="stat-trend">Total</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>Success Rate</h3>
          <div className="stat-value">
            {stats.successRate.toFixed(1)}%
            <span className="stat-trend">Healthy</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>Avg. Latency</h3>
          <div className="stat-value">
            {stats.avgResponse.toFixed(2)}ms
            <span className="stat-trend">Target: &lt;500ms</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <Line data={responseTimeChart} options={chartOptions} />
      </div>

      <div className="chart-container">
        <Bar data={statusCodeChart} options={{
          ...chartOptions,
          plugins: {
            title: { text: 'Status Code Distribution' }
          }
        }} />
      </div>
    </div>
  );
};

export default PerformanceMonitor;