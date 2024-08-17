import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartMax = ({ data }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (data && data.length > 0) {
            // Prepare chart data
            setChartData({
                labels: data.map(item => item.state),
                datasets: [
                    {
                        label: 'Enrollment',
                        data: data.map(item => item.enrollment),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            });
        }
    }, [data]);

    // Render a loading message or placeholder until data is ready
    if (!chartData) {
        return <p>Loading chart...</p>;
    }

    // Chart options
    const options = {
        scales: {
            y: {
                beginAtZero: true,
                min: 0,  // Set a suitable minimum value
                // max: 930000000, // Set a suitable maximum value
                ticks: {
                    callback: (value) => {
                        // Format large numbers with commas
                        return new Intl.NumberFormat().format(value);
                    }
                }
            }
        }
    };

    return <div className="flex justify-center items-center w-full h-full bg-white shadow-lg rounded-lg p-4">
        <Bar data={chartData} options={options} />
    </div>;
};

export default BarChartMax;
