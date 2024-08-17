import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { stateAbbreviationMap } from '../utils/stateAbbreviations'; // Adjust path if needed
const api_url = import.meta.env.VITE_API_URL

const getColor = (d) => {
  return d > 10000000 ? '#800026' :
    d > 5000000 ? '#BD0026' :
      d > 1000000 ? '#E31A1C' :
        d > 500000 ? '#FC4E2A' :
          d > 100000 ? '#FD8D3C' :
            d > 50000 ? '#FEB24C' :
              '#FED976';
};

const style = (feature) => ({
  fillColor: getColor(feature.properties.enrollment || 0),
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.7
});

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

const MapBounds = () => {
  const map = useMap();
  useEffect(() => {
    const bounds = [[24.396308, -125.0], [49.384358, -66.93457]];
    map.setMaxBounds(bounds);
    map.setMinZoom(4);
    map.setMaxZoom(10);
    map.fitBounds(bounds);
  }, [map]);

  return null;
};

const ChoroplethMap = () => {
  const [mapData, setMapData] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch('/us-states.geojson');
        const data = await response.json();
        setMapData(data);
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
      }
    };

    fetchMapData();
  }, []); // Fetch GeoJSON data once on mount

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      try {
        const response = await fetch(`${api_url}/api/v1/enrollment_geo_data`);
        const data = await response.json();
        setEnrollmentData(data.result);
      } catch (error) {
        console.error('Error fetching enrollment data:', error);
      }
    };

    fetchEnrollmentData();
  }, []); // Fetch enrollment data once on mount

  useEffect(() => {
    if (mapData && enrollmentData.length > 0) {
      setLoading(false); // Set loading to false only when both data are available
    }
  }, [mapData, enrollmentData]);

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

  if (loading) {
    return <div className="flex justify-center items-center w-full h-full bg-white shadow-lg rounded-lg p-4">
      <Loader />
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg sticky">
      <MapContainer
        center={[37.8, -96]}
        zoom={4}
        className="h-[500px] w-full"
        scrollWheelZoom={false}
        zoomControl={true}
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
