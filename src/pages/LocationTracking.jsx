import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LocationMap from '../components/LocationMap';
import LocationList from '../components/LocationList';
import AddLocationModal from '../components/AddLocationModal';

const { FiPlus, FiMap, FiList } = FiIcons;

const LocationTracking = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('map');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Location Tracking</h1>
          <p className="text-gray-600">Manage and monitor your tracked locations</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'map' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <SafeIcon icon={FiMap} className="inline mr-2" />
              Map View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <SafeIcon icon={FiList} className="inline mr-2" />
              List View
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="text-lg" />
            <span>Add Location</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {viewMode === 'map' ? (
          <div className="h-96">
            <LocationMap />
          </div>
        ) : (
          <LocationList />
        )}
      </motion.div>

      <AddLocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LocationTracking;