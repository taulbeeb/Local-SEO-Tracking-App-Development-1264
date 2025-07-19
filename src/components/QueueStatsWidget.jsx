import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import serpApi from '../services/serpApi';

const { FiClock, FiPlay, FiCheck, FiX } = FiIcons;

const QueueStatsWidget = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await serpApi.getQueueStats();
      setStats(response.stats);
      setError(null);
    } catch (error) {
      console.error('Error fetching queue stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">SERP Queue Status</h3>
        <div className="text-red-600 text-sm">
          Error loading queue stats: {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">SERP Queue Status</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg mb-2 mx-auto">
            <SafeIcon icon={FiClock} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.waiting || 0}</p>
          <p className="text-sm text-gray-600">Waiting</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-2 mx-auto">
            <SafeIcon icon={FiPlay} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.active || 0}</p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-2 mx-auto">
            <SafeIcon icon={FiCheck} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.completed || 0}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mb-2 mx-auto">
            <SafeIcon icon={FiX} className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.failed || 0}</p>
          <p className="text-sm text-gray-600">Failed</p>
        </div>
      </div>
    </motion.div>
  );
};

export default QueueStatsWidget;