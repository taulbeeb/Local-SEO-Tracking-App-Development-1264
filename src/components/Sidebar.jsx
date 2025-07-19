import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiSearch, FiMapPin, FiTrendingUp, FiFileText, FiSettings, FiTarget } = FiIcons;

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', icon: FiHome, path: '/' },
    { name: 'Keyword Tracking', icon: FiSearch, path: '/keywords' },
    { name: 'Location Tracking', icon: FiMapPin, path: '/locations' },
    { name: 'Rankings', icon: FiTrendingUp, path: '/rankings' },
    { name: 'Reports', icon: FiFileText, path: '/reports' },
    { name: 'Settings', icon: FiSettings, path: '/settings' },
  ];

  return (
    <motion.div
      initial={false}
      animate={{
        width: isOpen ? 280 : 80,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white shadow-lg border-r border-gray-200 flex flex-col"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiTarget} className="text-white text-xl" />
          </div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-xl font-bold text-gray-800">LocalSEO Pro</h1>
              <p className="text-sm text-gray-500">Map Pack Tracker</p>
            </motion.div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item, index) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`
                }
              >
                <SafeIcon icon={item.icon} className="text-xl" />
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;