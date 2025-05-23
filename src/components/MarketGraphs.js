import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, 
  ArcElement, 
  LineElement, 
  BarElement, 
  PointElement, 
  BarController, 
  LineController, 
  CategoryScale, 
  LinearScale, 
  TimeScale,
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import './MarketData.css';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  LineElement, 
  BarElement, 
  PointElement, 
  BarController, 
  LineController, 
  CategoryScale, 
  LinearScale, 
  TimeScale,
  Tooltip, 
  Legend,
  Filler
);

// Animation durations
const ANIMATION_DURATION = 1500;

// IRSAD Chart Component
export const IRSADChart = ({ data }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    const chart = chartRef.current;
    
    if (chart) {
      // Add animation on mount
      const canvas = chart.canvas;
      canvas.style.transition = 'opacity 1s ease-in-out';
      canvas.style.opacity = '0';
      
      setTimeout(() => {
        canvas.style.opacity = '1';
      }, 100);
    }
  }, []);
  
  // Prepare data for gauge chart
  const gaugeData = {
    labels: ['IRSAD Score'],
    datasets: [
      {
        data: [data.currentValue, data.maxValue - data.currentValue],
        backgroundColor: [
          'rgba(52, 152, 219, 0.8)',
          'rgba(220, 220, 220, 0.5)'
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      }
    ]
  };
  
  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    animation: {
      duration: ANIMATION_DURATION,
      easing: 'easeOutQuart'
    }
  };
  
  return (
    <div className="insight-card">
      <h3>IRSAD Score</h3>
      <div className="data-source">Data: {data.source}</div>
      <div className="chart-container">
        <div className="gauge-chart-container">
          <div className="gauge-chart">
            <Doughnut ref={chartRef} data={gaugeData} options={gaugeOptions} />
            <div className="gauge-value">{data.currentValue}</div>
            <div className="gauge-label">IRSAD Score</div>
            <div className="gauge-percentile">{data.percentile}th percentile</div>
          </div>
        </div>
        <div className="chart-description">
          {data.description}
        </div>
      </div>
    </div>
  );
};

// Renters to Owners Chart Component
export const RentersToOwnersChart = ({ data }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    const chart = chartRef.current;
    
    if (chart) {
      // Add animation on mount
      const canvas = chart.canvas;
      canvas.style.transition = 'transform 1s ease-in-out';
      canvas.style.transform = 'scale(0.8)';
      
      setTimeout(() => {
        canvas.style.transform = 'scale(1)';
      }, 100);
    }
  }, []);
  
  // Prepare data for donut chart
  const donutData = {
    labels: ['Owners', 'Renters'],
    datasets: [
      {
        data: [data.owners, data.renters],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(52, 152, 219, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };
  
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.raw + '%';
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: ANIMATION_DURATION,
      easing: 'easeOutCirc'
    }
  };
  
  return (
    <div className="insight-card">
      <h3>Renters to Owners Ratio</h3>
      <div className="data-source">Data: {data.source}</div>
      <div className="chart-container">
        <div className="donut-chart-container">
          <Doughnut ref={chartRef} data={donutData} options={donutOptions} />
        </div>
        <div className="chart-description">
          {data.description}
        </div>
      </div>
    </div>
  );
};

// Stock on Market Chart Component
export const StockOnMarketChart = ({ data }) => {
  const chartRef = useRef(null);
  
  // Prepare data for line chart
  const lineData = {
    labels: data.history.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'Unsold Listings',
        data: data.history.map(item => item.value),
        borderColor: 'rgba(231, 76, 60, 1)',
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(231, 76, 60, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    },
    animation: {
      duration: ANIMATION_DURATION,
      easing: 'easeOutQuad',
      delay: (context) => context.dataIndex * 100
    }
  };
  
  return (
    <div className="insight-card">
      <h3>Stock on Market</h3>
      <div className="data-source">Data: {data.source}</div>
      <div className="chart-container">
        <div className="line-chart-container">
          <Line ref={chartRef} data={lineData} options={lineOptions} />
        </div>
        <div className="chart-description">
          {data.description} Current: {data.current} listings ({data.percentChange > 0 ? '+' : ''}{data.percentChange}% from previous month)
        </div>
      </div>
    </div>
  );
};

// Inventory Levels Chart Component
export const InventoryLevelsChart = ({ data }) => {
  const chartRef = useRef(null);
  
  // Prepare data for bar chart
  const barData = {
    labels: data.history.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'Inventory (Months)',
        data: data.history.map(item => item.value),
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    },
    animation: {
      duration: ANIMATION_DURATION,
      easing: 'easeOutBounce',
      delay: (context) => context.dataIndex * 50
    }
  };
  
  return (
    <div className="insight-card">
      <h3>Inventory Levels</h3>
      <div className="data-source">Data: {data.source}</div>
      <div className="chart-container">
        <div className="bar-chart-container">
          <Bar ref={chartRef} data={barData} options={barOptions} />
        </div>
        <div className="chart-description">
          {data.description} Current: {data.current} months ({data.percentChange > 0 ? '+' : ''}{data.percentChange}% from previous month)
        </div>
      </div>
    </div>
  );
};

// Building Approvals Chart Component
export const BuildingApprovalsChart = ({ data }) => {
  const chartRef = useRef(null);
  
  // Prepare data for grouped bar chart
  const barData = {
    labels: data.history.map(item => item.year),
    datasets: [
      {
        label: 'Houses',
        data: data.history.map(item => item.houses),
        backgroundColor: 'rgba(46, 204, 113, 0.8)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Units',
        data: data.history.map(item => item.units),
        backgroundColor: 'rgba(155, 89, 182, 0.8)',
        borderColor: 'rgba(155, 89, 182, 1)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        stacked: false
      },
      x: {
        grid: {
          display: false
        },
        stacked: false
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    },
    animation: {
      duration: ANIMATION_DURATION,
      easing: 'easeOutQuart',
      delay: (context) => context.datasetIndex * 100 + context.dataIndex * 50
    }
  };
  
  return (
    <div className="insight-card">
      <h3>Building Approvals</h3>
      <div className="data-source">Data: {data.source}</div>
      <div className="chart-container">
        <div className="bar-chart-container">
          <Bar ref={chartRef} data={barData} options={barOptions} />
        </div>
        <div className="chart-description">
          {data.description} Current: {data.current.total} approvals ({data.percentChange > 0 ? '+' : ''}{data.percentChange}% from previous year)
        </div>
      </div>
    </div>
  );
};

// Days on Market Chart Component
export const DaysOnMarketChart = ({ data }) => {
  const chartRef = useRef(null);
  
  // Prepare data for line chart
  const lineData = {
    labels: data.history.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'Days on Market',
        data: data.history.map(item => item.value),
        borderColor: 'rgba(243, 156, 18, 1)',
        backgroundColor: 'rgba(243, 156, 18, 0.2)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointBackgroundColor: 'rgba(243, 156, 18, 1)',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    },
    animation: {
      duration: ANIMATION_DURATION,
      easing: 'easeOutQuad'
    }
  };
  
  return (
    <div className="insight-card">
      <h3>Days on Market</h3>
      <div className="data-source">Data: {data.source}</div>
      <div className="chart-container">
        <div className="line-chart-container">
          <Line ref={chartRef} data={lineData} options={lineOptions} />
        </div>
        <div className="chart-description">
          {data.description} Current: {data.current} days ({data.percentChange > 0 ? '+' : ''}{data.percentChange}% from previous month)
        </div>
      </div>
    </div>
  );
};

// Vacancy Rate Chart Component
export const VacancyRateChart = ({ data }) => {
  const chartRef = useRef(null);
  
  // Prepare data for area chart
  const areaData = {
    labels: data.history.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'Vacancy Rate',
        data: data.history.map(item => item.value),
        borderColor: 'rgba(41, 128, 185, 1)',
        backgroundColor: 'rgba(41, 128, 185, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(41, 128, 185, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };
  
  const areaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.raw + '%';
          }
        }
      }
    },
    animation: {
      duration: ANIMATION_DURATION,
      easing: 'easeOutSine'
    }
  };
  
  return (
    <div className="insight-card">
      <h3>Vacancy Rate</h3>
      <div className="data-source">Data: {data.source}</div>
      <div className="chart-container">
        <div className="area-chart-container">
          <Line ref={chartRef} data={areaData} options={areaOptions} />
        </div>
        <div className="chart-description">
          {data.description} Current: {data.current}% ({data.percentChange > 0 ? '+' : ''}{data.percentChange}% from previous month)
        </div>
        <div className="threshold-indicators">
          <div className="threshold">
            <span className="threshold-label">Tight Market:</span>
            <span className="threshold-value">&lt; {data.thresholds.tight}%</span>
          </div>
          <div className="threshold">
            <span className="threshold-label">Balanced Market:</span>
            <span className="threshold-value">{data.thresholds.tight}% - {data.thresholds.balanced}%</span>
          </div>
          <div className="threshold">
            <span className="threshold-label">Oversupplied:</span>
            <span className="threshold-value">&gt; {data.thresholds.oversupplied}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Search Index Chart Component
export const SearchIndexChart = ({ data }) => {
  const chartRef = useRef(null);
  
  // Prepare data for line chart
  const lineData = {
    labels: data.history.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'Search Index',
        data: data.history.map(item => item.value),
        borderColor: 'rgba(155, 89, 182, 1)',
        backgroundColor: 'rgba(155, 89, 182, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(155, 89, 182, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 100,
            yMax: 100,
            borderColor: 'rgba(0, 0, 0, 0.3)',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              content: 'Average (100)',
              enabled: true,
              position: 'start'
            }
          }
        }
      }
    },
    animation: {
      duration: ANIMATION_DURATION,
      easing: 'easeOutQuad'
    }
  };
  
  return (
    <div className="insight-card">
      <h3>Search Index</h3>
      <div className="data-source">Data: {data.source}</div>
      <div className="chart-container">
        <div className="line-chart-container">
          <Line ref={chartRef} data={lineData} options={lineOptions} />
        </div>
        <div className="chart-description">
          {data.description} Current: {data.current} ({data.percentChange > 0 ? '+' : ''}{data.percentChange}% from previous month)
        </div>
      </div>
    </div>
  );
};

// Auction Clearance Rate Chart Component
export const AuctionClearanceRateChart = ({ data }) => {
  const chartRef = useRef(null);
  
  // Prepare data for gauge chart (using pie chart)
  const gaugeData = {
    labels: ['Clearance Rate', 'Remaining'],
    datasets: [
      {
        data: [data.current, 100 - data.current],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(220, 220, 220, 0.5)'
        ],
        borderWidth: 0
      }
    ]
  };
  
  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    circumference: 180,
    rotation: 270,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    animation: {
      duration: ANIMATION_DURATION,
      easing: 'easeOutQuart'
    }
  };
  
  // Prepare data for historical line
  const lineData = {
    labels: data.history.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'Clearance Rate',
        data: data.history.map(item => item.value),
        borderColor: 'rgba(46, 204, 113, 1)',
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(46, 204, 113, 1)',
        pointBorderColor: '#fff',
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        min: 50,
        max: 80,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.raw + '%';
          }
        }
      }
    },
    animation: {
      duration: ANIMATION_DURATION,
      easing: 'easeOutQuad'
    }
  };
  
  return (
    <div className="insight-card">
      <h3>Auction Clearance Rate</h3>
      <div className="data-source">Data: {data.source}</div>
      <div className="chart-container">
        <div className="gauge-chart-container">
          <div className="gauge-chart">
            <Pie ref={chartRef} data={gaugeData} options={gaugeOptions} />
            <div className="gauge-value">{data.current}%</div>
            <div className="gauge-label">Clearance Rate</div>
          </div>
        </div>
        <div className="historical-chart">
          <Line data={lineData} options={lineOptions} />
        </div>
        <div className="chart-description">
          {data.description} Current: {data.current}% ({data.percentChange > 0 ? '+' : ''}{data.percentChange}% from previous month)
        </div>
      </div>
    </div>
  );
};
