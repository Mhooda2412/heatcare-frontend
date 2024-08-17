import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const TopPlansPieChart = ({ data }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // If data is passed and not empty, set loading to false
        if (data && data.length > 0) {
            setIsLoading(false);
        }
    }, [data]); // Run the effect whenever `data` changes

    if (isLoading) {
        return (
            <div className='overflow-hidden w-full h-full bg-white shadow-lg rounded-lg p-4'>
                <h2>Top 5 Plans by Enrollment</h2>
                <p>Loading data, please wait...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className='overflow-hidden w-full h-full bg-white shadow-lg rounded-lg p-4'>
                <h2>Top 5 Plans by Enrollment</h2>
                <p>No data available to display.</p>
            </div>
        );
    }

    // Sort data by Plan_Enrollment in descending order and pick the top 5
    const topPlans = data
        .sort((a, b) => b.Plan_Enrollment - a.Plan_Enrollment)
        .slice(0, 5);

    const chartData = {
        labels: topPlans.map(plan => `Plan ${plan.plan_id}`),
        datasets: [
            {
                label: 'Top 5 Plans by Enrollment',
                data: topPlans.map(plan => plan.Plan_Enrollment),
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
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const plan = topPlans[tooltipItem.dataIndex];
                        return [
                            `Plan ${plan.plan_id}`,
                            `Enrollment: ${plan.Plan_Enrollment}`,
                            `Proportion: ${plan.Percentage_of_Total_Enrollments}%`,
                            `States: ${plan.Count_of_States}`,
                        ];
                    },
                },
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
    };

    return (
        <div className="flex justify-center items-center w-full h-full bg-white shadow-lg rounded-lg p-4">
  <Pie data={chartData} options={chartOptions} />
</div>
    );
};

export default TopPlansPieChart;
