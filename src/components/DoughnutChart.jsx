import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Loader from './Loader';

Chart.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ data }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrg, setSelectedOrg] = useState('');

    useEffect(() => {
        if (data && data.length > 0) {
            setIsLoading(false);
            setSelectedOrg(data[0].parent_organization); // Default to the first organization
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
                <h2>Total Enrollment by Plan Type</h2>
                <p>No data available to display.</p>
            </div>
        );
    }

    const filteredData = data.filter(d => d.parent_organization === selectedOrg);

    const totalEnrollment = filteredData.reduce((sum, d) => sum + d.total_enrollment, 0);

    const chartData = {
        labels: filteredData.map(d => d.plan_type),
        datasets: [
            {
                label: 'Total Enrollment',
                data: filteredData.map(d => d.total_enrollment),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
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
                        const plan = filteredData[tooltipItem.dataIndex];
                        const percentage = ((plan.total_enrollment / totalEnrollment) * 100).toFixed(2);
                        return [
                            `Plan Type: ${plan.plan_type}`,
                            `Enrollment: ${plan.total_enrollment}`,
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

    const organizations = [...new Set(data.map(d => d.parent_organization))];

    return (
        <div className="overflow-hidden w-full h-full bg-white shadow-lg rounded-lg p-4 relative">
            <div className="mb-4">
                <label className="font-medium">Select Organization: </label>
                <select
                    onChange={e => setSelectedOrg(e.target.value)}
                    value={selectedOrg}
                    className="ml-2 p-2 border rounded-md"
                >
                    {organizations.map(org => (
                        <option key={org} value={org}>
                            {org}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-center items-center w-full h-full">
                <div className="w-full h-64">
                    <Doughnut data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default DoughnutChart;
