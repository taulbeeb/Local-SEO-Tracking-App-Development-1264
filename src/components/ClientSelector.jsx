import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useClient } from '../context/ClientContext';

const { FiChevronDown, FiPlus, FiSettings } = FiIcons;

const ClientSelector = () => {
  const { clients, currentClient, switchClient, loading } = useClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleClientChange = (clientId) => {
    switchClient(clientId);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center px-4 py-2 bg-gray-100 rounded-md">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
        <span className="text-sm text-gray-600">Loading clients...</span>
      </div>
    );
  }

  if (!currentClient && clients.length === 0) {
    return (
      <Link
        to="/clients/add"
        className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
      >
        <SafeIcon icon={FiPlus} className="mr-2" />
        <span className="text-sm">Add Your First Client</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        {currentClient && (
          <>
            {currentClient.logo_url ? (
              <img 
                src={currentClient.logo_url} 
                alt={currentClient.name} 
                className="w-6 h-6 rounded object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                {currentClient.name.substring(0, 1)}
              </div>
            )}
            <span className="text-sm font-medium">{currentClient.name}</span>
            <SafeIcon icon={FiChevronDown} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-2 w-64 bg-white rounded-md shadow-lg"
          >
            <div className="py-1">
              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => handleClientChange(client.id)}
                  className={`w-full text-left flex items-center justify-between px-4 py-3 hover:bg-gray-100 ${
                    currentClient && currentClient.id === client.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {client.logo_url ? (
                      <img 
                        src={client.logo_url} 
                        alt={client.name} 
                        className="w-6 h-6 rounded object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        {client.name.substring(0, 1)}
                      </div>
                    )}
                    <span className="text-sm">{client.name}</span>
                  </div>
                  {currentClient && currentClient.id === client.id && (
                    <Link
                      to={`/clients/${client.id}/settings`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <SafeIcon icon={FiSettings} className="text-sm" />
                    </Link>
                  )}
                </button>
              ))}
              
              <div className="border-t border-gray-100 mt-1 pt-1">
                <Link
                  to="/clients/add"
                  className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <SafeIcon icon={FiPlus} className="mr-2" />
                    Add New Client
                  </div>
                </Link>
                <Link
                  to="/clients"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <SafeIcon icon={FiSettings} className="mr-2" />
                    Manage Clients
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientSelector;