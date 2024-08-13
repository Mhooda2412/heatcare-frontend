import React, { useEffect, useState } from 'react';
import BarChart from './BarChart';
import axios from 'axios';

const BarChartPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/enrolment_group_state")
      .then(response => {
        console.log(response)
        const data = response.data;
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching the data', error);
        setError('Error fetching the data');
      });
  }, []);

  return (
    <div className="flex flex-col items-center  min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Enrollment Data</h1>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="w-full max-w-4xl">
          <BarChart data={data} />
        </div>
      )}
    </div>
  );
};

export default BarChartPage;
