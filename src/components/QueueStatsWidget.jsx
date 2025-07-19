import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiClock, FiPlay, FiCheck, FiX } = FiIcons;

const QueueStatsWidget = () => {
  const [stats, setStats] = useState({
    waiting: 0,
    active: 0,
    completed: 5,
    failed: 0
  });
  const [loading, setLoading] = useState(false);

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

export default QuestStatsWidget;