import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'; // Import arrow icons
import Loader from './Loader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartMax = ({ data }) => {
    const [chartData, setChartData] = useState(null);
    const [showTop, setShowTop] = useState(true); // Toggle state for top 3 or bottom 3 (reversed)
    const [isChecked, setIsChecked] = useState(true); // Switch state (reversed)

    useEffect(() => {
        if (data && data.length > 0) {
            const sortedData = [...data].sort((a, b) => b.total_enrollment - a.total_enrollment);
            const filteredData = showTop ? sortedData.slice(0, 3) : sortedData.slice(-3);

            setChartData({
                labels: filteredData.map(item => item.state),
                datasets: [
                    {
                        label: 'Enrollment',
                        data: filteredData.map(item => item.total_enrollment),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            });
        }
    }, [data, showTop]);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        setShowTop(!showTop);
    };

    if (!chartData) {
        return <div className="flex justify-center items-center w-full h-full bg-white shadow-lg rounded-lg p-4">
            <Loader />
        </div>;
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                ticks: {
                    callback: (value) => new Intl.NumberFormat().format(value)
                }
            }
        },
        plugins: {
            tooltip: {
                intersect: false,
                mode: 'index',
            }
        }
    };

    return (
        <div className="relative flex flex-col justify-center items-center w-full h-full bg-white shadow-lg rounded-lg p-4">
            <label className='themeSwitcherTwo absolute top-4 left-4 inline-flex cursor-pointer select-none items-center'>
                <input
                    type='checkbox'
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className='sr-only'
                />
                <span className='label flex items-center text-sm font-medium text-black'>
                    Least
                </span>
                <span
                    className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                        isChecked ? 'bg-[#24a0ed]' : 'bg-[#24a0ed]'
                    }`}
                >
                    <span
                        className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                            isChecked ? 'translate-x-[28px]' : ''
                        }`}
                    ></span>
                </span>
                <span className='label flex items-center text-sm font-medium text-black'>
                    Most
                </span>
            </label>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BarChartMax;
