import LineChart from "./LineChart";
import D3ChoroplethMap from "./D3Map";
import BarChartMax from "./BarChartMax";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';
import TopPlansPieChart from './TopPlansPieChart';
import DoughnutChart from "./DoughnutChart";

const api_url = import.meta.env.VITE_API_URL;

const LineChartPage = () => {
  const [lineData, setLineData] = useState(null);
  const [currentMAEnrollments, setCurrentMAEnrollments] = useState(null);
  const [totalMedicareEnrollments, setTotalMedicareEnrollments] = useState(null);
  const [UsStatePlan, setUsStatePlan] = useState({});
  const [planData, setPlanData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [planPieData, setPlanPieData] = useState(null)
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api_url}/api/v1/current_ma_enrollments`)
        const latest_enrollment = response.data.latest_enrollment
        setCurrentMAEnrollments(latest_enrollment)
      } catch (error) {
        console.error('Error fetching the data', error);
        setError('Error fetching the data');
      }

      try {
        const response = await axios.get(`${api_url}/api/v1/total_medicare_enrollments`)
        const latest_enrollment = response.data.latest_enrollment
        setTotalMedicareEnrollments(latest_enrollment)
      } catch (error) {
        console.error('Error fetching the data', error);
        setError('Error fetching the data');
      }

      try {
        const response = await axios.get(`${api_url}/api/v1/current_month_state_plan`)
        const state_enrollment = response.data.current_month_state_plan
        setUsStatePlan(state_enrollment)

        // Sort data by total enrollment in descending order
        state_enrollment.sort((a, b) => b.total_enrollment - a.total_enrollment);
        const top3 = state_enrollment.slice(0, 3).map(item => ({
          state: item.state,
          total_enrollment: item.total_enrollment
        }));

        const bottom3 = state_enrollment.slice(-3).map(item => ({
          state: item.state,
          total_enrollment: item.total_enrollment
        }));

        const combinedResults = [...top3, ...bottom3];
        setBarData(combinedResults)

      } catch (error) {
        console.error('Error fetching the data', error);
        setError('Error fetching the data');
      }

      try {
        const response = await axios.get(`${api_url}/api/v1/trend_over_time`)
        const trend_over_time = response.data.trend_over_time
        setLineData(trend_over_time)
      } catch (error) {
        console.error('Error fetching the data', error);
        setError('Error fetching the data');
      }

      try {
        const response = await axios.get(`${api_url}/api/v1/plan_with_parent_org_filter`)
        const plan_with_parent_org_filter = response.data.plan_with_parent_org_filter
        setPlanData(plan_with_parent_org_filter)
      } catch (error) {
        console.error('Error fetching the data', error);
        setError('Error fetching the data');
      }

      try {
        const response = await axios.get(`${api_url}/api/v1/plan`)
        const plan = response.data.plan
        setPlanPieData(plan)
      } catch (error) {
        console.error('Error fetching the data', error);
        setError('Error fetching the data');
      }



    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-4 w-full h-full bg-gray-100 p-4">
      {/* Cards Section */}
      <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="bg-white p-6 rounded-lg shadow-md flex-1">
          <h2 className="text-lg font-semibold mb-2">Current MA Enrollments</h2>
          <p className="text-3xl font-bold">
            <CountUp end={currentMAEnrollments} duration={2.5} />
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex-1">
          <h2 className="text-lg font-semibold mb-2">Total Medicare Enrollments</h2>
          <p className="text-3xl font-bold">
            <CountUp end={totalMedicareEnrollments} duration={2.5} />
          </p>
        </div>
        {/* <div className="bg-white p-6 rounded-lg shadow-md flex-1">
          <h2 className="text-lg font-semibold mb-2">Latest Year Enrollment</h2>
          <p className="text-3xl font-bold">
            <CountUp end={latestYearTotalEnrollment} duration={2.5} />
          </p>
        </div> */}
      </div>

      {/* Charts Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="flex-1 flex flex-col items-center min-w-[300px]">
            <h1 className="text-2xl font-bold mb-4">Enrollment Trends </h1>
            <div className="w-full h-[400px] max-w-full">
              <LineChart data={lineData} />
            </div>
          </div>

          <div className="flex-[1] flex flex-col items-center min-w-[300px]">
          <h1 className="text-2xl font-bold mb-4">Enrollment Split by Plans</h1>
          <div className="w-full h-[400px] max-w-full">
            <TopPlansPieChart data={planPieData} />
          </div>
        </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="flex-[1] flex flex-col items-center min-w-[300px]">
            <h1 className="text-2xl font-bold mb-4">Plan Composition by Organization</h1>
            <div className="w-full h-[400px] max-w-full">
              <DoughnutChart data={planData} />
            </div>
          </div>
          <div className="flex-[1] flex flex-col items-center min-w-[300px]">
            <h1 className="text-2xl font-bold mb-4">Most & Least Enrollment</h1>
            <div className="w-full h-[400px] max-w-full">
              <BarChartMax data={barData} />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center min-w-[300px]">
            <h1 className="text-2xl font-bold mb-4">Enrollment Across States</h1>
            <div className="w-full h-[400px] max-w-full">
              <D3ChoroplethMap enrollmentData={UsStatePlan} />
            </div>
          </div>
      </div>
    </div>
  );
};

export default LineChartPage;
