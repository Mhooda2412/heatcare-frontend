import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import { stateAbbreviationMap } from '../utils/stateAbbreviations';
import { stateIdToName } from '../utils/stateId';

// Color mapping function
const getColor = (d) => {
  return d > 500000000 ? '#800026' :    // Very High
    d > 100000000 ? '#BD0026' :    // High
      d > 50000000 ? '#E31A1C' :    // Moderate-High
        d > 10000000 ? '#FC4E2A' :    // Moderate
          d > 5000000 ? '#FD8D3C' :    // Low-Moderate
            d > 1000000 ? '#FEB24C' :    // Low
              d > 500000 ? '#FED976' :    // Very Low
                '#FFEDA0';    // Minimal
};

const D3ChoroplethMap = ({ enrollmentData }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (Object.keys(enrollmentData).length === 0) return; // Wait for data to be loaded

    const svg = d3.select(svgRef.current);
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    svg.attr('width', width)
      .attr('height', height);

    const path = d3.geoPath();

    d3.json('https://d3js.org/us-10m.v1.json').then(data => {
      svg.selectAll('g').remove(); // Clear previous drawings

      const states = svg.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(feature(data, data.objects.states).features)
        .enter().append('path')
        .attr('d', path)
        .attr('data-id', d => d.id)
        .attr('fill', d => {
          const stateId = d.id;
          const stateName = stateIdToName[stateId] || 'Unknown';
          const stateAbbreviation = stateAbbreviationMap[stateName];
          const enrollment = enrollmentData[stateAbbreviation] || {};
          return getColor(enrollment.total_enrollment || 0);
        })
        .on('mouseover', function (event, d) {
          const [x, y] = d3.pointer(event);
          const stateId = d.id;
          const stateName = stateIdToName[stateId] || 'Unknown';
          const stateAbbreviation = stateAbbreviationMap[stateName];
          const enrollment = enrollmentData[stateAbbreviation] || {};

          const htmlContent = `
            <div class="p-4 shadow-lg rounded-md tooltip">
              <h2 class="text-xl font-bold text-gray-800 mb-2">${stateName}</h2>
              <p class="text-gray-600"><span class="font-semibold">Enrollment:</span> ${enrollment.total_enrollment?.toLocaleString() || 'N/A'}</p>
              <p class="text-gray-600"><span class="font-semibold">Popular Plan:</span> ${enrollment.popular_plan || 'N/A'}</p>
              <p class="text-gray-600"><span class="font-semibold">Growth Rate:</span> ${enrollment.growth_rate !== null ? enrollment.growth_rate : 'N/A'}</p>
            </div>`;

          const tooltip = d3.select(tooltipRef.current)
            .style('visibility', 'visible')
            .style('top', `${y}px`)
            .style('left', `${x}px`)
            .html(htmlContent);

          const tooltipElement = tooltip.node();
          const tooltipWidth = tooltipElement.offsetWidth;
          const tooltipHeight = tooltipElement.offsetHeight;
          const svgBounds = svg.node().getBoundingClientRect();

          let adjustedX = x;
          let adjustedY = y;

          if (x + tooltipWidth > svgBounds.width) {
            adjustedX = svgBounds.width - tooltipWidth - 10;
          }

          if (y + tooltipHeight > svgBounds.height) {
            adjustedY = svgBounds.height - tooltipHeight - 10;
          }

          tooltip
            .style('top', `${adjustedY}px`)
            .style('left', `${adjustedX}px`);
        })
        .on('mouseout', () => {
          d3.select(tooltipRef.current)
            .style('visibility', 'hidden');
        });

      svg.append('path')
        .attr('class', 'state-borders')
        .attr('d', path(mesh(data, data.objects.states, (a, b) => a !== b)));
    }).catch(error => {
      console.error('Error loading or parsing GeoJSON data:', error);
    });
  }, [enrollmentData]); // Depend on enrollmentData to re-render when data changes

  return (
    <div className="relative overflow-hidden w-full h-full p-4 bg-white shadow-lg rounded-lg">
      <svg ref={svgRef} className='w-full h-full' viewBox="0 0 960 600">
        <style>
          {`
            .states path:hover {
              fill: red;
            }
            .state-borders {
              fill: none;
              stroke: #fff;
              stroke-width: 0.5px;
              stroke-linejoin: round;
              stroke-linecap: round;
              pointer-events: none;
            }
            .tooltip {
              white-space: nowrap; /* Prevent text from wrapping to the next line */
              max-width: 300px; /* Optional: set a maximum width for the tooltip */
              overflow: hidden; /* Hide overflow text */
              background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
              border: 1px solid rgba(0, 0, 0, 0.5); /* Slightly transparent border */
            }
          `}
        </style>
      </svg>
      <div
        ref={tooltipRef}
        className="absolute bg-white border border-black p-2 rounded text-xs"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          visibility: 'hidden'
        }}
      />
    </div>
  );
};

export default D3ChoroplethMap;
