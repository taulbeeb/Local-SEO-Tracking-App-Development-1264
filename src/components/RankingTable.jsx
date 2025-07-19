import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiTrendingDown, FiMinus, FiMapPin } = FiIcons;

const RankingTable = () => {
  const rankings = [
    {
      id: 1,
      keyword: 'pizza delivery',
      location: 'Manhattan, NY',
      currentRank: 2,
      previousRank: 5,
      change: 3,
      trend: 'up',
      mapPack: true,
      competitor1: 'Tony\'s Pizza',
      competitor2: 'Mario\'s Kitchen'
    },
    {
      id: 2,
      keyword: 'italian restaurant',
      location: 'Brooklyn, NY',
      currentRank: 6,
      previousRank: 3,
      change: -3,
      trend: 'down',
      mapPack: false,
      competitor1: 'Bella Vista',
      competitor2: 'Giuseppe\'s'
    },
    {
      id: 3,
      keyword: 'best pizza near me',
      location: 'Queens, NY',
      currentRank: 1,
      previousRank: 1,
      change: 0,
      trend: 'stable',
      mapPack: true,
      competitor1: 'Pizza Palace',
      competitor2: 'Slice Heaven'
    },
    {
      id: 4,
      keyword: 'pizza restaurant',
      location: 'Bronx, NY',
      currentRank: 4,
      previousRank: 7,
      change: 3,
      trend: 'up',
      mapPack: true,
      competitor1: 'Bronx Pizza',
      competitor2: 'Family Pizza'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') return FiTrendingUp;
    if (trend === 'down') return FiTrendingDown;
    return FiMinus;
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  const getRankColor = (rank) => {
    if (rank <= 3) return 'bg-green-100 text-green-800';
    if (rank <= 6) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Keyword</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Rank</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Change</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Map Pack</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Top Competitors</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((ranking, index) => (
            <motion.tr
              key={ranking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="font-medium text-gray-800">{ranking.keyword}</div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMapPin} className="text-gray-500 text-sm" />
                  <span className="text-gray-600">{ranking.location}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRankColor(ranking.currentRank)}`}>
                  #{ranking.currentRank}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <SafeIcon 
                    icon={getTrendIcon(ranking.trend)} 
                    className={`text-sm ${getTrendColor(ranking.trend)}`}
                  />
                  <span className={`text-sm font-medium ${getTrendColor(ranking.trend)}`}>
                    {ranking.change > 0 ? '+' : ''}{ranking.change}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ranking.mapPack 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {ranking.mapPack ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm text-gray-600">
                  <div>{ranking.competitor1}</div>
                  <div>{ranking.competitor2}</div>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;