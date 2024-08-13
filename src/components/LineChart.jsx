import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [yearsToShow, setYearsToShow] = useState(5); // Start with the top 5 years

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/trends_over_time");
        const data = response.data.result;

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Data is not in expected format or is empty");
        }

        // Group data by year and sum rejections
        const groupedData = new Map();
        data.forEach(item => {
          if (!groupedData.has(item.year)) {
            groupedData.set(item.year, { totals: Array(12).fill(null), rejections: 0 });
          }
          const monthIndex = parseInt(item.month, 10) - 1;
          groupedData.get(item.year).totals[monthIndex] = item.total_enrollment;
          groupedData.get(item.year).rejections += item.total_enrollment;
        });

        // Sort by rejections and slice the top N years to display
        const sortedYears = Array.from(groupedData.entries())
          .sort((a, b) => b[1].rejections - a[1].rejections)
          .slice(0, yearsToShow);

        const labels = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        const datasets = sortedYears.map(([year, { totals }]) => ({
          label: year,
          data: totals,
          borderColor: getRandomColor(),
          fill: false,
          tension: 0.3,
        }));

        setChartData({
          labels: labels,
          datasets: datasets,
        });
      } catch (error) {
        console.error('Error fetching the data', error);
        setError('Error fetching the data');
      }
    };

    fetchData();
  }, [yearsToShow]); // Re-fetch when yearsToShow changes

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const loadMoreYears = () => {
    setYearsToShow(prev => prev + 5); // Load 5 more years
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : chartData ? (
        <>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `Year ${context.dataset.label}: ${context.parsed.y}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Month',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Total Enrollment',
                  },
                },
              },
            }}
          />
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={loadMoreYears}
          >
            Load More Years
          </button>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default LineChart;
