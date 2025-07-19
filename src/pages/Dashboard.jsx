import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import MetricCard from '../components/MetricCard';
import RankingChart from '../components/RankingChart';
import RecentActivity from '../components/RecentActivity';
import QueueStatsWidget from '../components/QueueStatsWidget';

const { FiTrendingUp, FiMapPin, FiSearch, FiTarget } = FiIcons;

const Dashboard = () => {
  const metrics = [
    {
      title: 'Average Position',
      value: '3.2',
      change: '+0.5',
      trend: 'up',
      icon: FiTrendingUp,
      color: 'blue'
    },
    {
      title: 'Tracked Keywords',
      value: '247',
      change: '+12',
      trend: 'up',
      icon: FiSearch,
      color: 'green'
    },
    {
      title: 'Locations Monitored',
      value: '18',
      change: '+3',
      trend: 'up',
      icon: FiMapPin,
      color: 'purple'
    },
    {
      title: 'Map Pack Appearances',
      value: '89%',
      change: '+5%',
      trend: 'up',
      icon: FiTarget,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Monitor your local SEO performance across all locations</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RankingChart />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <QueueStatsWidget />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <RecentActivity />
      </motion.div>
    </div>
  );
};

export default Dashboard;