import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiCalendar, FiFileText } = FiIcons;

const CreateReportModal = ({ isOpen, onClose }) => {
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [dateRange, setDateRange] = useState('30d');

  const reportTypes = [
    { value: 'performance', label: 'Performance Overview' },
    { value: 'keyword', label: 'Keyword Analysis' },
    { value: 'location', label: 'Location Performance' },
    { value: 'competitor', label: 'Competitor Analysis' },
    { value: 'custom', label: 'Custom Report' }
  ];

  const locations = [
    'Manhattan, NY',
    'Brooklyn, NY',
    'Queens, NY',
    'Bronx, NY'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Report Config:', {
      reportName,
      reportType,
      selectedLocations,
      selectedKeywords,
      dateRange
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Create Report</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter report name"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select report type</option>
                    {reportTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locations
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {locations.map((location) => (
                      <label key={location} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(location)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLocations([...selectedLocations, location]);
                            } else {
                              setSelectedLocations(selectedLocations.filter(l => l !== location));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Generate Report
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateReportModal;