import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMap = () => {
  const locations = [
    { id: 1, name: 'Downtown Location', lat: 40.7128, lng: -74.0060, ranking: 2 },
    { id: 2, name: 'Midtown Branch', lat: 40.7589, lng: -73.9851, ranking: 1 },
    { id: 3, name: 'Brooklyn Office', lat: 40.6782, lng: -73.9442, ranking: 4 },
    { id: 4, name: 'Queens Branch', lat: 40.7282, lng: -73.7949, ranking: 3 },
  ];

  const center = [40.7128, -74.0060];

  const getRankingColor = (ranking) => {
    if (ranking <= 3) return '#10B981'; // Green
    if (ranking <= 6) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Location Performance Map</h2>
      <div className="h-80 rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* 100-mile radius circle */}
          <Circle
            center={center}
            radius={160934} // 100 miles in meters
            color="#3B82F6"
            fillColor="#3B82F6"
            fillOpacity={0.1}
            weight={2}
          />
          
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={L.divIcon({
                html: `<div style="background-color: ${getRankingColor(location.ranking)}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${location.ranking}</div>`,
                className: 'custom-marker',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              })}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-gray-600">Average Ranking: #{location.ranking}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Top 3 Rankings</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <span>Ranks 4-6</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Below 6</span>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;