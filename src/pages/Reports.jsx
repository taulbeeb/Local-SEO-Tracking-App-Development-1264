import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ReportCard from '../components/ReportCard';
import CreateReportModal from '../components/CreateReportModal';

const { FiPlus, FiDownload, FiEye, FiCalendar, FiFileText } = FiIcons;

const Reports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reports = [
    {
      id: 1,
      title: 'Weekly Local SEO Performance',
      description: 'Comprehensive overview of local search rankings',
      type: 'Weekly',
      lastGenerated: '2024-01-15',
      status: 'Ready',
      size: '2.3 MB'
    },
    {
      id: 2,
      title: 'Monthly Keyword Analysis',
      description: 'In-depth analysis of keyword performance trends',
      type: 'Monthly',
      lastGenerated: '2024-01-01',
      status: 'Ready',
      size: '4.1 MB'
    },
    {
      id: 3,
      title: 'Location Performance Report',
      description: 'Performance metrics across all tracked locations',
      type: 'Custom',
      lastGenerated: '2024-01-10',
      status: 'Generating',
      size: '1.8 MB'
    },
    {
      id: 4,
      title: 'Competitor Analysis',
      description: 'Comparison with local competitors',
      type: 'Bi-weekly',
      lastGenerated: '2024-01-08',
      status: 'Ready',
      size: '3.2 MB'
    }
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
          <p className="text-gray-600">Generate and manage your SEO performance reports</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="text-lg" />
          <span>Create Report</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ReportCard report={report} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Scheduled Reports</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiCalendar} className="text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">Weekly Performance Summary</p>
                <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiFileText} className="text-purple-600" />
              <div>
                <p className="font-medium text-gray-800">Monthly Comprehensive Report</p>
                <p className="text-sm text-gray-600">First day of each month at 8:00 AM</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
          </div>
        </div>
      </motion.div>

      <CreateReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Reports;