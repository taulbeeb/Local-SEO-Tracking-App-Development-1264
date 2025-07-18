import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiTrendingDown, FiMapPin, FiSearch } = FiIcons;

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'ranking_up',
      title: 'Keyword "pizza delivery" improved',
      description: 'Moved from position 5 to 2 in Manhattan',
      time: '2 hours ago',
      icon: FiTrendingUp,
      color: 'green'
    },
    {
      id: 2,
      type: 'ranking_down',
      title: 'Keyword "italian restaurant" declined',
      description: 'Dropped from position 3 to 6 in Brooklyn',
      time: '4 hours ago',
      icon: FiTrendingDown,
      color: 'red'
    },
    {
      id: 3,
      type: 'location_added',
      title: 'New location added',
      description: 'Queens Branch is now being tracked',
      time: '1 day ago',
      icon: FiMapPin,
      color: 'blue'
    },
    {
      id: 4,
      type: 'keyword_added',
      title: 'New keywords added',
      description: '15 new keywords added to tracking',
      time: '2 days ago',
      icon: FiSearch,
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${getColorClasses(activity.color)}`}>
              <SafeIcon icon={activity.icon} className="text-lg" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{activity.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;