import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Loader from './Loader';

Chart.register(ArcElement, Tooltip, Legend);

const TopPlansPieChart = ({ data }) => {
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (data && data.length > 0) {
            setIsLoading(false);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-full bg-white shadow-lg rounded-lg p-4">
                <Loader />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="overflow-hidden w-full h-full bg-white shadow-lg rounded-lg p-4">
                <h2>Plans by Enrollment</h2>
                <p>No data available to display.</p>
            </div>
        );
    }

    // Calculate total enrollment for percentage calculation
    const totalEnrollment = data.reduce((acc, curr) => acc + curr.total_enrollment, 0);

    const chartData = {
        labels: data.map(d => d.plan_type),
        datasets: [
            {
                label: 'Plans by Enrollment',
                data: data.map(d => d.total_enrollment),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FFCD56',
                    '#4BC0C0',
                    '#36A2EB',
                    '#FF6384',
                ],
                hoverOffset: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const plan = data[tooltipItem.dataIndex];
                        const percentage = ((plan.total_enrollment / totalEnrollment) * 100).toFixed(2);
                        return [
                            `Plan Type: ${plan.plan_type}`,
                            `Enrollment: ${plan.total_enrollment.toLocaleString()}`,
                            `Percentage: ${percentage}%`
                        ];
                    },
                },
            },
            legend: {
                display: true,
                position: 'bottom',
            },
        },
    };

    return (
        <div className="overflow-hidden w-full h-full bg-white shadow-lg rounded-lg p-4 relative">
            <div className="flex justify-center items-center w-full h-full">
                <div className="w-full h-64">
                    <Pie data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default TopPlansPieChart;
