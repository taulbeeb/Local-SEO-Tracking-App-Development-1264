import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useClient } from '../context/ClientContext';
import supabase from '../lib/supabase';

const { FiArrowLeft, FiSave, FiUser, FiMail, FiPhone, FiGlobe, FiFileText, FiLoader } = FiIcons;

const AddClient = () => {
  const [formData, setFormData] = useState({
    name: '',
    primary_contact: '',
    email: '',
    phone: '',
    website: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { addClient } = useClient();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Updated regex pattern without unnecessary escapes
      if (formData.website && !formData.website.match(/^(https?:\/\/)?([\w.-]+\.[a-zA-Z]{2,})(\/\S*)?$/)) {
        throw new Error('Please enter a valid website URL');
      }
      
      // Add http:// prefix if missing
      let websiteUrl = formData.website;
      if (websiteUrl && !websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = 'https://' + websiteUrl;
      }
      
      const clientData = {
        ...formData,
        website: websiteUrl
      };
      
      console.log("Attempting to insert client:", clientData);
      
      // Direct insert to Supabase
      const { data, error: supabaseError } = await supabase
        .from('clients_seo_87a5cd9f')
        .insert([clientData])
        .select();
        
      if (supabaseError) {
        console.error("Supabase insert error:", supabaseError);
        throw new Error(supabaseError.message || 'Failed to add client');
      }
      
      console.log("Client created successfully:", data);
      
      // Update the client context
      if (addClient && typeof addClient === 'function' && data && data[0]) {
        await addClient(data[0]);
      } else {
        console.warn("Client data missing or addClient function not available", { data, addClient });
      }
      
      navigate('/clients');
    } catch (err) {
      console.error("Error creating client:", err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center"
      >
        <Link to="/clients" className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <SafeIcon icon={FiArrowLeft} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Client</h1>
          <p className="text-gray-600">Create a new client to start tracking their local SEO performance</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiGlobe}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Contact
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiUser}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="primary_contact"
                  value={formData.primary_contact}
                  onChange={handleChange}
                  placeholder="Enter contact name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiMail}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiPhone}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiGlobe}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Example: example.com</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <div className="relative">
              <SafeIcon
                icon={FiFileText}
                className="absolute left-3 top-3 text-gray-400"
              />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter any additional notes"
                rows={4}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Link
              to="/clients"
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <SafeIcon icon={FiSave} className="mr-2" />
                  Save Client
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddClient;