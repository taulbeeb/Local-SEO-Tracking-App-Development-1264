import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ClientSelector from './ClientSelector';
import { useAuth } from '../context/AuthContext';

const { FiMenu, FiBell, FiUser, FiRefreshCw, FiLogOut } = FiIcons;

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiMenu} className="text-gray-600 text-xl" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Local SEO Dashboard</h2>
            <p className="text-sm text-gray-500">Track your local search rankings</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <ClientSelector />
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <SafeIcon icon={FiBell} className="text-gray-600 text-xl" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <SafeIcon icon={FiRefreshCw} className="text-gray-600 text-xl" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="text-white text-sm" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.full_name || user?.email}</span>
              </button>
              
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                >
                  <div className="py-1">
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <Link 
                      to="/clients" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Manage Clients
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <SafeIcon icon={FiLogOut} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;