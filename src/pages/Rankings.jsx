import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import RankingChart from '../components/RankingChart';
import RankingTable from '../components/RankingTable';

const { FiTrendingUp, FiTrendingDown, FiMinus, FiCalendar } = FiIcons;

const Rankings = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const summaryStats = [
    {
      title: 'Top 3 Rankings',
      value: '124',
      change: '+8',
      trend: 'up',
      icon: FiTrendingUp,
      color: 'green'
    },
    {
      title: 'Improved Rankings',
      value: '67',
      change: '+12',
      trend: 'up',
      icon: FiTrendingUp,
      color: 'blue'
    },
    {
      title: 'Declined Rankings',
      value: '23',
      change: '-5',
      trend: 'down',
      icon: FiTrendingDown,
      color: 'red'
    },
    {
      title: 'Stable Rankings',
      value: '89',
      change: '0',
      trend: 'stable',
      icon: FiMinus,
      color: 'gray'
    }
  ];

  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rankings Overview</h1>
          <p className="text-gray-600">Track your local search ranking performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiCalendar} className="text-gray-600" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <SafeIcon icon={stat.icon} className={`text-${stat.color}-600 text-xl`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Ranking Trends</h2>
        <RankingChart period={selectedPeriod} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Detailed Rankings</h2>
        <RankingTable />
      </motion.div>
    </div>
  );
};

export default Rankings;