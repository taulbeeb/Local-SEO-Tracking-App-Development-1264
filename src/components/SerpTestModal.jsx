import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import serpApi from '../services/serpApi';

const { FiX, FiSearch, FiMapPin, FiPlay } = FiIcons;

const SerpTestModal = ({ isOpen, onClose }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState({ name: '', lat: '', lng: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleTest = async () => {
    if (!keyword || !location.name) {
      setError('Please enter both keyword and location');
      return;
    }

    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await serpApi.testSearch(keyword, location);
      setResults(response.results);
    } catch (err) {
      setError(err.message || 'Failed to perform search');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setKeyword('');
    setLocation({ name: '', lat: '', lng: '' });
    setResults(null);
    setError('');
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
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Test SERP Scraper</h2>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keyword
                  </label>
                  <div className="relative">
                    <SafeIcon
                      icon={FiSearch}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g., pizza delivery"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Name
                    </label>
                    <div className="relative">
                      <SafeIcon
                        icon={FiMapPin}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={location.name}
                        onChange={(e) => setLocation({ ...location, name: e.target.value })}
                        placeholder="e.g., New York, NY"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude (Optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={location.lat}
                      onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                      placeholder="40.7128"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude (Optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={location.lng}
                      onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                      placeholder="-74.0060"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleTest}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <SafeIcon icon={FiPlay} />
                  )}
                  <span>{isLoading ? 'Searching...' : 'Test Search'}</span>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {results && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Search Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Keyword:</span>
                        <p className="font-medium">{results.keyword}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium">{results.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Organic Results:</span>
                        <p className="font-medium">{results.organic?.length || 0}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Map Pack:</span>
                        <p className="font-medium">{results.mapPack?.length || 0}</p>
                      </div>
                    </div>
                  </div>

                  {results.mapPack && results.mapPack.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Map Pack Results</h3>
                      <div className="space-y-2">
                        {results.mapPack.map((result, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {result.position}
                            </span>
                            <div>
                              <p className="font-medium text-gray-800">{result.title}</p>
                              {result.address && (
                                <p className="text-sm text-gray-600">{result.address}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.organic && results.organic.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Organic Results (Top 10)</h3>
                      <div className="space-y-2">
                        {results.organic.slice(0, 10).map((result, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {result.position}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{result.title}</p>
                              <p className="text-sm text-blue-600 mb-1">{result.domain}</p>
                              {result.snippet && (
                                <p className="text-sm text-gray-600">{result.snippet}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SerpTestModal;