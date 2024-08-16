import React, { useState,useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Modal from './Modal'; // Import the Modal component

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthlyData, setMonthlyData] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (data) {
      const yearlyTotals = new Map();
      data.forEach(item => {
        const year = item.year;
        if (!yearlyTotals.has(year)) {
          yearlyTotals.set(year, 0);
        }
        yearlyTotals.set(year, yearlyTotals.get(year) + item.total_enrollment);
      });

      const labels = Array.from(yearlyTotals.keys()).sort();
      const totals = labels.map(year => yearlyTotals.get(year));

      setChartData({
        labels: labels,
        datasets: [{
          label: 'Total Enrollment',
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

      const monthlyTotals = new Map();
      filteredData.forEach(item => {
        const month = item.month;
        if (!monthlyTotals.has(month)) {
          monthlyTotals.set(month, 0);
        }
        monthlyTotals.set(month, monthlyTotals.get(month) + item.total_enrollment);
      });

      const labels = Array.from(monthlyTotals.keys()).sort((a, b) => a - b);
      const totals = labels.map(month => monthlyTotals.get(month));

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
                            callback: function (value) {
                              const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
                              return months[value];
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
                <div>Loading monthly data...</div>
              )}
            </div>
          </Modal>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default LineChart;
