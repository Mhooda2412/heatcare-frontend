import LineChart from "./LineChart";
import D3ChoroplethMap from "./D3Map";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';

const api_url = import.meta.env.VITE_API_URL;

const LineChartPage = () => {
  const [lineData, setLineData] = useState(null);
  const [totalEnrolment, setTotalEnrolment] = useState(null)
  const [latestMonthEnrollment, setLatestMonthEnrollment] = useState(null)
  const [latestYearTotalEnrollment, setLatestYearTotalEnrollment] = useState(null)
  const [enrollmentData, setEnrollmentData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api_url}/api/v1/trends_over_time`);
        const fetchedData = response.data.result;

        if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
          throw new Error("Data is not in expected format or is empty");
        }
        setLineData(fetchedData);
        const totalEnrollmentSum = fetchedData.reduce((sum, item) => sum + item.total_enrollment, 0);
        setTotalEnrolment(totalEnrollmentSum)

        // Find the latest year
        const latestYear = Math.max(...fetchedData.map(item => item.year));

        // Filter data for the latest year
        const dataForLatestYear = fetchedData.filter(item => item.year === latestYear);

        // Calculate the total enrollment for the latest year
        setLatestYearTotalEnrollment(dataForLatestYear.reduce((sum, item) => sum + item.total_enrollment, 0));

        // Find the latest month for the latest year
        const latestMonth = Math.max(...dataForLatestYear.map(item => item.month));

        // Filter data for the latest month in the latest year
        const dataForLatestMonth = dataForLatestYear.filter(item => item.month === latestMonth);

        // Calculate the total enrollment for the latest month
        setLatestMonthEnrollment(dataForLatestMonth.reduce((sum, item) => sum + item.total_enrollment, 0));



      } catch (error) {
        console.error('Error fetching the data', error);
        setError('Error fetching the data');
      }
      fetch(`${api_url}/api/v1/enrollment_geo_data`)
        .then(response => response.json())
        .then(data => {
          const dataMap = data.result.reduce((acc, item) => {
            acc[item.state] = item;
            return acc;
          }, {});
          setEnrollmentData(dataMap);
          // Step 1: Calculate Total Enrollment
          const totalEnrollment = data.result.reduce((sum, entry) => sum + entry.total_enrollment, 0);

          // Step 2: Group by State and Determine Popular Plan
          const statePopularPlans = {};
          data.result.forEach((entry) => {
            if (entry.state !== "NaN") {
              const plan = entry.popular_plan;
              const state = entry.state;
              const enrollment = entry.total_enrollment;

              if (!statePopularPlans[state]) {
                statePopularPlans[state] = { plan_id: plan, enrollment: enrollment };
              } else if (statePopularPlans[state].enrollment < enrollment) {
                statePopularPlans[state] = { plan_id: plan, enrollment: enrollment };
              }
            }
          });

          // Step 3: Calculate Plan Enrollments
          const planEnrollments = {};
          Object.values(statePopularPlans).forEach((entry) => {
            if (planEnrollments[entry.plan_id]) {
              planEnrollments[entry.plan_id] += entry.enrollment;
            } else {
              planEnrollments[entry.plan_id] = entry.enrollment;
            }
          });

          // Step 4: Calculate Percentage of Total Enrollments and Count of States
          const result = Object.keys(planEnrollments).map((plan_id) => {
            const planEnrollment = planEnrollments[plan_id];
            const percentageOfTotalEnrollments = ((planEnrollment / totalEnrollment) * 100).toFixed(2);
            const countOfStates = Object.values(statePopularPlans).filter((entry) => entry.plan_id === parseInt(plan_id)).length;

            return {
              plan_id: parseInt(plan_id),
              Plan_Enrollment: planEnrollment,
              Percentage_of_Total_Enrollments: percentageOfTotalEnrollments,
              Count_of_States: countOfStates,
            };
          });

          // Final result
          console.log(result);
        })
        .catch(error => {
          console.error('Error fetching enrollment data:', error);
        });
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-4 w-full h-full bg-gray-100 p-4">
      {/* Cards Section */}
      <div className="flex flex-row justify-between space-x-4">
        <div className="bg-white p-6 rounded-lg shadow-md flex-1">
          <h2 className="text-lg font-semibold mb-2">Total Enrollment</h2>
          <p className="text-3xl font-bold">
            <CountUp end={totalEnrolment} duration={2.5} />
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex-1">
          <h2 className="text-lg font-semibold mb-2">Latest Month Enrollment</h2>
          <p className="text-3xl font-bold">
            <CountUp end={latestMonthEnrollment} duration={2.5} />
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex-1">
          <h2 className="text-lg font-semibold mb-2">Latest Year Enrollment</h2>
          <p className="text-3xl font-bold">
            <CountUp end={latestYearTotalEnrollment} duration={2.5} />
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-row flex-wrap justify-between items-stretch w-full space-x-4">
        <div className="flex-1 flex flex-col items-center mb-4 min-w-[300px]">
          <h1 className="text-2xl font-bold mb-4">Enrollment Trends Over Time</h1>
          <div className="w-full h-[400px] max-w-full">
            <LineChart data={lineData} />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center mb-4 min-w-[300px]">
          <h1 className="text-2xl font-bold mb-4">Choropleth Map</h1>
          <div className="w-full h-[400px] max-w-full">
            <D3ChoroplethMap enrollmentData={enrollmentData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineChartPage;
