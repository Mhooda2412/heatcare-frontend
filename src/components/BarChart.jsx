import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.state),
    datasets: [
      {
        label: 'Total Enrollment',
        data: data.map(item => item.total_enrollment),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Enrollment by State',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'States',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Enrollment',
        },
      },
    },
  };

  return (
    <div className="relative h-96 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
