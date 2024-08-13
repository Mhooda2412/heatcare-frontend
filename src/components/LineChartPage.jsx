import LineChart from "./LineChart";
import ChoroplethMap from "./ChoroplethMap";
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const data = [
  {"state":"","popular_plan":"001","growth_rate":null,"total_enrollment":195114.0},
  {"state":"AK","popular_plan":"033","growth_rate":null,"total_enrollment":115923.0},
  // ... add the rest of your data here
];

const LineChartPage = () => {
  return (
    <>
      <div className="flex flex-col items-center w-full h-full bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Enrollment Trends Over Time</h1>
        <div className="w-full max-w-4xl">
          <LineChart />
        </div>
      </div>

      <div className="flex flex-col items-center w-full h-full bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Enrollment Trends Over Time</h1>
        <div className="w-full max-w-4xl">
          <ChoroplethMap data={data} />
        </div>
      </div>
    </>
  );
};

export default LineChartPage;
