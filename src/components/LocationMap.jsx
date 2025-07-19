import React from 'react';

const LocationMap = () => {
  const locations = [
    { id: 1, name: 'Downtown Location', lat: 40.7128, lng: -74.0060, ranking: 2 },
    { id: 2, name: 'Midtown Branch', lat: 40.7589, lng: -73.9851, ranking: 1 },
    { id: 3, name: 'Brooklyn Office', lat: 40.6782, lng: -73.9442, ranking: 4 },
    { id: 4, name: 'Queens Branch', lat: 40.7282, lng: -73.7949, ranking: 3 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Location Performance Map</h2>
      <div className="h-80 rounded-lg overflow-hidden" style={{ backgroundColor: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-gray-500">Map visualization loading...</p>
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