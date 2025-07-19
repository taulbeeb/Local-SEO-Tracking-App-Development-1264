import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import {useClient} from '../context/ClientContext';

const {FiX, FiPlus, FiMapPin, FiCheck, FiLoader} = FiIcons;

const AddKeywordModal = ({isOpen, onClose}) => {
  const [keywords, setKeywords] = useState(['']);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const {currentClient} = useClient();

  // Fetch locations for the current client
  useEffect(() => {
    const fetchLocations = async () => {
      if (!currentClient) {
        setLocations([]);
        setLoadingLocations(false);
        return;
      }

      try {
        setLoadingLocations(true);
        const {data, error} = await supabase
          .from('locations_seo_87a5cd9f')
          .select('*')
          .eq('client_id', currentClient.id);

        if (error) throw error;

        setLocations(data || []);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations');
      } finally {
        setLoadingLocations(false);
      }
    };

    if (isOpen) {
      fetchLocations();
    }
  }, [currentClient, isOpen]);

  const addKeywordField = () => {
    setKeywords([...keywords, '']);
  };

  const removeKeywordField = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const updateKeyword = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentClient) {
      setError('No client selected. Please select a client first.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      let locationId = null;

      // Handle location selection
      if (selectedLocation === 'custom') {
        if (!customLocation.trim()) {
          throw new Error('Please enter a custom location');
        }
        
        // Create new location
        const {data: newLocationData, error: locationError} = await supabase
          .from('locations_seo_87a5cd9f')
          .insert([{
            client_id: currentClient.id,
            name: customLocation,
            address: customLocation,
            city: customLocation.split(',')[0] || customLocation,
            state: customLocation.split(',')[1]?.trim() || '',
            country: 'USA'
          }])
          .select()
          .single();

        if (locationError) throw locationError;
        locationId = newLocationData.id;
      } else if (selectedLocation) {
        locationId = selectedLocation;
      } else {
        throw new Error('Please select a location');
      }

      // Filter out empty keywords
      const validKeywords = keywords.filter(k => k.trim() !== '');
      if (validKeywords.length === 0) {
        throw new Error('Please enter at least one keyword');
      }

      // Insert keywords
      const keywordsToInsert = validKeywords.map(keyword => ({
        client_id: currentClient.id,
        keyword: keyword.trim(),
        search_volume: Math.floor(Math.random() * 1000) + 100 // Random volume for demo
      }));

      const {data: keywordData, error: keywordError} = await supabase
        .from('keywords_seo_87a5cd9f')
        .insert(keywordsToInsert)
        .select();

      if (keywordError) throw keywordError;

      // Create keyword-location tracking relationships
      const trackingData = keywordData.map(keyword => ({
        keyword_id: keyword.id,
        location_id: locationId,
        is_active: true,
        tracking_frequency: 'weekly'
      }));

      const {error: trackingError} = await supabase
        .from('keyword_location_tracking_seo_87a5cd9f')
        .insert(trackingData);

      if (trackingError) throw trackingError;

      // Reset form
      setKeywords(['']);
      setSelectedLocation('');
      setCustomLocation('');
      setSuccess(true);

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);

    } catch (err) {
      console.error('Error adding keywords:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{scale: 0.95, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.95, opacity: 0}}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Add Keywords</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-gray-500" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg flex items-center">
                  <SafeIcon icon={FiCheck} className="mr-2" />
                  Keywords added successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loadingLocations}
                    >
                      <option value="">
                        {loadingLocations ? 'Loading locations...' : 'Select a location'}
                      </option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                      <option value="custom">Add New Location</option>
                    </select>
                  </div>
                  
                  {selectedLocation === 'custom' && (
                    <input
                      type="text"
                      placeholder="Enter new location (e.g., Manhattan, NY)"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <div className="space-y-3">
                    {keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Enter keyword"
                          value={keyword}
                          onChange={(e) => updateKeyword(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        {keywords.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKeywordField(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiX} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addKeywordField}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <SafeIcon icon={FiPlus} />
                      <span>Add another keyword</span>
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Add Keywords'
                    )}
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

export default AddKeywordModal;