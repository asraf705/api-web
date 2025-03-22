import React from 'react';
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
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import './DataVisualization.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DataVisualization = ({ apiData }) => {
  if (!apiData || typeof apiData !== 'object') {
    return <div className="no-data">No data available for visualization</div>;
  }

  const prepareChartData = (data) => {
    if (Array.isArray(data)) {
      // Handle array data
      return {
        labels: data.map((_, index) => `Item ${index + 1}`),
        values: data.map(item => typeof item === 'number' ? item : Object.keys(item).length)
      };
    } else {
      // Handle object data
      return {
        labels: Object.keys(data),
        values: Object.values(data).map(value => 
          typeof value === 'number' ? value : 
          typeof value === 'object' ? Object.keys(value).length : 
          1
        )
      };
    }
  };

  const { labels, values } = prepareChartData(apiData);

  const lineChartData = {
    labels,
    datasets: [{
      label: 'API Data Trend',
      data: values,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const barChartData = {
    labels,
    datasets: [{
      label: 'API Data Distribution',
      data: values,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    }]
  };

  const pieChartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };

  return (
    <div className="data-visualization">
      <div className="chart-container">
        <h3>Line Chart</h3>
        <div className="chart">
          <Line data={lineChartData} options={options} />
        </div>
      </div>

      <div className="chart-container">
        <h3>Bar Chart</h3>
        <div className="chart">
          <Bar data={barChartData} options={options} />
        </div>
      </div>

      <div className="chart-container">
        <h3>Pie Chart</h3>
        <div className="chart">
          <Pie data={pieChartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;