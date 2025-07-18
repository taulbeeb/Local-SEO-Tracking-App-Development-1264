import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useClient } from '../context/ClientContext';
import supabase from '../lib/supabase';

const { FiPlus, FiMoreVertical, FiEdit, FiTrash2, FiExternalLink, FiUsers, FiLoader, FiRefreshCw } = FiIcons;

const Clients = () => {
  const { clients, deleteClient, currentClient, switchClient } = useClient();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localClients, setLocalClients] = useState([]);
  
  useEffect(() => {
    // Update local clients when the context clients change
    setLocalClients(clients);
  }, [clients]);
  
  // Function to manually refresh clients list
  const refreshClients = async () => {
    setIsLoading(true);
    try {
      console.log("Manually refreshing clients...");
      const { data, error } = await supabase
        .from('clients_seo_87a5cd9f')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      console.log("Refreshed clients:", data);
      setLocalClients(data || []);
    } catch (err) {
      console.error("Error refreshing clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuToggle = (clientId) => {
    setActiveMenu(activeMenu === clientId ? null : clientId);
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      await deleteClient(clientId);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Clients</h1>
          <p className="text-gray-600">Manage your client accounts and settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshClients}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <SafeIcon 
              icon={isLoading ? FiLoader : FiRefreshCw} 
              className={`text-gray-600 text-xl ${isLoading ? 'animate-spin' : ''}`} 
            />
          </button>
          <Link
            to="/clients/add"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <SafeIcon icon={FiPlus} className="text-lg" />
            <span>Add New Client</span>
          </Link>
        </div>
      </motion.div>

      {localClients.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiUsers} className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Clients Yet</h2>
          <p className="text-gray-600 mb-6">You haven't added any clients to your account yet.</p>
          <Link
            to="/clients/add"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Your First Client</span>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                currentClient && currentClient.id === client.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {client.logo_url ? (
                      <img src={client.logo_url} alt={client.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-lg font-bold">
                        {client.name.substring(0, 1)}
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-800">{client.name}</h3>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => handleMenuToggle(client.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <SafeIcon icon={FiMoreVertical} className="text-gray-500" />
                    </button>
                    {activeMenu === client.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                      >
                        <div className="py-1">
                          <Link
                            to={`/clients/${client.id}/settings`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <SafeIcon icon={FiEdit} className="mr-3 text-gray-500" />
                            Edit Settings
                          </Link>
                          {client.website && (
                            <a
                              href={client.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <SafeIcon icon={FiExternalLink} className="mr-3 text-gray-500" />
                              Visit Website
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <SafeIcon icon={FiTrash2} className="mr-3" />
                            Delete Client
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
                {client.website && (
                  <p className="text-sm text-gray-600 mb-2">
                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {client.website.replace(/^https?:\/\//, '')}
                    </a>
                  </p>
                )}
                {client.email && (
                  <p className="text-sm text-gray-600">
                    {client.email}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.accessLevel === 'admin' ? 'bg-purple-100 text-purple-800' :
                    client.accessLevel === 'editor' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {client.accessLevel ? (client.accessLevel.charAt(0).toUpperCase() + client.accessLevel.slice(1)) : 'User'}
                  </span>
                  {currentClient && currentClient.id === client.id ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Current
                    </span>
                  ) : (
                    <button
                      onClick={() => switchClient(client.id)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm transition-colors"
                    >
                      Switch
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;