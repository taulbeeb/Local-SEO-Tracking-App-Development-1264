import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMapPin, FiTrendingUp, FiTrendingDown, FiMoreVertical } = FiIcons;

const LocationList = () => {
  const locations = [
    {
      id: 1,
      name: 'Downtown Manhattan',
      address: '123 Broadway, New York, NY 10001',
      avgRank: 2.3,
      keywords: 45,
      mapPackAppearances: 89,
      trend: 'up',
      change: '+0.5'
    },
    {
      id: 2,
      name: 'Brooklyn Heights',
      address: '456 Court St, Brooklyn, NY 11201',
      avgRank: 3.8,
      keywords: 32,
      mapPackAppearances: 76,
      trend: 'down',
      change: '-0.3'
    },
    {
      id: 3,
      name: 'Queens Center',
      address: '789 Queens Blvd, Elmhurst, NY 11373',
      avgRank: 4.2,
      keywords: 28,
      mapPackAppearances: 68,
      trend: 'up',
      change: '+0.8'
    },
    {
      id: 4,
      name: 'Bronx Plaza',
      address: '321 Grand Concourse, Bronx, NY 10451',
      avgRank: 5.1,
      keywords: 19,
      mapPackAppearances: 52,
      trend: 'up',
      change: '+1.2'
    }
  ];

  const getRankColor = (rank) => {
    if (rank <= 3) return 'bg-green-100 text-green-800';
    if (rank <= 6) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? FiTrendingUp : FiTrendingDown;
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <SafeIcon icon={FiMapPin} className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">{location.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{location.address}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Avg Rank</p>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRankColor(location.avgRank)}`}>
                      #{location.avgRank}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Keywords</p>
                    <p className="text-lg font-semibold text-gray-800">{location.keywords}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Map Pack %</p>
                    <p className="text-lg font-semibold text-gray-800">{location.mapPackAppearances}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Trend</p>
                    <div className="flex items-center space-x-1">
                      <SafeIcon 
                        icon={getTrendIcon(location.trend)} 
                        className={`text-sm ${getTrendColor(location.trend)}`}
                      />
                      <span className={`text-sm font-medium ${getTrendColor(location.trend)}`}>
                        {location.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <SafeIcon icon={FiMoreVertical} className="text-gray-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LocationList;