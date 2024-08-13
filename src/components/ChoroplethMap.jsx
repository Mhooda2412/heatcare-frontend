import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { stateAbbreviationMap } from '../utils/stateAbbreviations'; // Adjust path if needed

// Helper function to get color based on enrollment value
const getColor = (d) => {
  return d > 10000000 ? '#800026' :
         d > 5000000  ? '#BD0026' :
         d > 1000000  ? '#E31A1C' :
         d > 500000   ? '#FC4E2A' :
         d > 100000   ? '#FD8D3C' :
         d > 50000    ? '#FEB24C' :
                        '#FED976';
};

// Helper function to style each feature
const style = (feature) => ({
  fillColor: getColor(feature.properties.enrollment || 0),
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.7
});

// Helper function to bind tooltips to each feature
const onEachFeature = (feature, layer) => {
  const { enrollment = 'N/A', popular_plan = 'N/A', growth_rate = 'N/A' } = feature.properties;
  layer.bindTooltip(
    `<h2 class="text-lg font-semibold">${feature.properties.name}</h2>
    <p>Enrollment: ${enrollment}</p>
    <p>Popular Plan: ${popular_plan}</p>
    <p>Growth Rate: ${growth_rate !== null ? growth_rate : 'N/A'}</p>`,
    { sticky: true }
  );
};

// Component to set map bounds and zoom constraints
const MapBounds = () => {
  const map = useMap();
  useEffect(() => {
    const bounds = [[24.396308, -125.0], [49.384358, -66.93457]]; // Adjust to your desired bounds
    map.setMaxBounds(bounds);
    map.setMinZoom(4); // Adjust the min zoom level if needed
    map.setMaxZoom(10); // Adjust the max zoom level if needed

    map.fitBounds(bounds);
  }, [map]);

  return null;
};

const ChoroplethMap = () => {
  const [mapData, setMapData] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState([]);

  useEffect(() => {
    // Fetch GeoJSON data
    fetch('/us-states.geojson') // Adjust the path to your GeoJSON file
      .then(response => response.json())
      .then(data => setMapData(data));

    // Fetch enrollment data
    fetch('http://127.0.0.1:8000/enrollment_geo_data')
      .then(response => response.json())
      .then(data => setEnrollmentData(data));
  }, []);

  // Merge enrollment data with GeoJSON data
  const mergeData = (geoData) => {
    if (!geoData || !enrollmentData.length) return geoData;

    const updatedFeatures = geoData.features.map(feature => {
      const stateName = feature.properties.name;
      const stateAbbreviation = stateAbbreviationMap[stateName];
      const enrollmentInfo = enrollmentData.find(item => item.state === stateAbbreviation);

      if (enrollmentInfo) {
        feature.properties.enrollment = enrollmentInfo.total_enrollment;
        feature.properties.popular_plan = enrollmentInfo.popular_plan;
        feature.properties.growth_rate = enrollmentInfo.growth_rate;
      } else {
        feature.properties.enrollment = 'N/A';
        feature.properties.popular_plan = 'N/A';
        feature.properties.growth_rate = 'N/A';
      }

      return feature;
    });

    return {
      ...geoData,
      features: updatedFeatures
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg sticky">
      <MapContainer 
        center={[37.8, -96]} 
        zoom={4} 
        className="h-[500px] w-full" 
        scrollWheelZoom={false} // Disable scroll wheel zoom
        zoomControl={true}      // Enable zoom control buttons
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapBounds />
        {mapData && (
          <GeoJSON
            data={mergeData(mapData)}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default ChoroplethMap;
