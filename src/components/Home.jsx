import React from 'react';
import { Link } from 'react-router-dom';

const cards = [
  { name: 'Enrolment Dashboard', imgSrc: 'line-chart.svg', path: '/line-chart' },
  { name: 'Contract Dashboard', imgSrc: 'bar-chart.svg', path: '/bar-chart' },
  // { name: 'Pie Chart', imgSrc: 'pie-chart.svg', path: '/' },
  // { name: 'Area Chart', imgSrc: 'area-chart.svg', path: '/' },
  // { name: 'Radar Chart', imgSrc: 'radar-chart.svg', path: '/' },
  // { name: 'Scatter Chart', imgSrc: 'scatter-chart.svg', path: '/' },
  // { name: 'Bubble Chart', imgSrc: 'bubble-chart.svg', path: '/' },
  // { name: 'Donut Chart', imgSrc: 'donut-chart.svg', path: '/' },
  // { name: 'Heatmap Chart', imgSrc: 'heatmap-chart.svg', path: '/' }
];

const Home = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg">
              <div className="w-full h-48 flex items-center justify-center overflow-clip">
                <Link to={card.path}>
                  <img src={card.imgSrc} alt={card.name} className="object-cover w-full h-48" />
                </Link>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{card.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
