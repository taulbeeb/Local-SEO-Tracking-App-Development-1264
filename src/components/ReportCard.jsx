import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiEye, FiClock, FiFileText } = FiIcons;

const ReportCard = ({ report }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800';
      case 'Generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Weekly':
        return 'bg-blue-100 text-blue-800';
      case 'Monthly':
        return 'bg-purple-100 text-purple-800';
      case 'Custom':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <SafeIcon icon={FiFileText} className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
            {report.type}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Last Generated:</span>
          <span className="text-gray-800">{report.lastGenerated}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Size:</span>
          <span className="text-gray-800">{report.size}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
          <SafeIcon icon={FiDownload} className="text-sm" />
          <span>Download</span>
        </button>
        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <SafeIcon icon={FiEye} className="text-sm" />
        </button>
      </div>
    </motion.div>
  );
};

export default ReportCard;