import React from 'react';

const RankingChart = ({ period = '7d' }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Ranking Performance</h2>
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-gray-500">Chart visualization loading...</p>
      </div>
    </div>
  );
};

export default RankingChart;