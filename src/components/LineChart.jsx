import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Modal from './Modal'; // Import the Modal component
import Loader from './Loader';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthlyData, setMonthlyData] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (data) {
      const latestMonthData = new Map();

      data.forEach(item => {
        const year = item.year;
        const month = item.month;
        if (!latestMonthData.has(year) || latestMonthData.get(year).month < month) {
          latestMonthData.set(year, { month, total_enrollment: item.total_enrollment });
        }
      });

      const labels = Array.from(latestMonthData.keys()).sort();
      const totals = labels.map(year => latestMonthData.get(year).total_enrollment);

      setChartData({
        labels: labels,
        datasets: [{
          label: 'Latest Month Enrollment',
          data: totals,
          borderColor: "blue",
          backgroundColor: 'rgba(0, 0, 255, 0.2)',
          fill: true,
          tension: 0.3,
        }],
      });
    }
  }, [data]);

  const handlePointClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const year = chartData.labels[index];
      setSelectedYear(year);

      const filteredData = data.filter(item => item.year === year);
      const sortedData = filteredData.sort((a, b) => b.month - a.month);

      const monthlyDataForModal = sortedData.map(item => ({
        month: item.month,
        total_enrollment: item.total_enrollment
      }));

      const labels = monthlyDataForModal.map(item => item.month).reverse();
      const totals = monthlyDataForModal.map(item => item.total_enrollment).reverse();

      setMonthlyData({
        labels: labels,
        datasets: [{
          label: `Monthly Enrollment for ${year}`,
          data: totals,
          borderColor: '#FF5733',
          fill: true,
          tension: 0.3,
        }],
      });

      setIsModalOpen(true);
    }
  };

  return (
    <div className="overflow-hidden w-full h-full bg-white shadow-lg rounded-lg">
      {chartData ? (
        <>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `Year ${context.label}: ${context.parsed.y}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Year',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Total Enrollment',
                  },
                },
              },
              onClick: handlePointClick,
            }}
          />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <div className="relative w-full h-full">
              {monthlyData ? (
                <div className="w-full h-full">
                  <Line
                    data={monthlyData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return `Month ${context.label}: ${context.parsed.y}`;
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
                          ticks: {
                            callback: function (value, index, values) {
                              // Directly return the month value from the labels array
                              return monthlyData.labels[index];
                            },
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
                </div>
              ) : (
                <div className="flex justify-center items-center w-full h-full bg-white shadow-lg rounded-lg p-4">
                  <Loader />
                </div>
              )}
            </div>
          </Modal>
        </>
      ) : (
        <div className="flex justify-center items-center w-full h-full bg-white shadow-lg rounded-lg p-4">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default LineChart;
