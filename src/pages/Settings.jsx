import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiBell, FiKey, FiMapPin, FiGlobe, FiSave } = FiIcons;

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'api', label: 'API Keys', icon: FiKey },
    { id: 'locations', label: 'Default Locations', icon: FiMapPin },
    { id: 'general', label: 'General', icon: FiGlobe }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={tab.icon} className="text-lg" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6"
        >
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'api' && <APISettings />}
          {activeTab === 'locations' && <LocationSettings />}
          {activeTab === 'general' && <GeneralSettings />}
        </motion.div>
      </div>
    </div>
  );
};

const ProfileSettings = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
        <input
          type="text"
          defaultValue="John"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
        <input
          type="text"
          defaultValue="Doe"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          defaultValue="john.doe@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
      <SafeIcon icon={FiSave} />
      <span>Save Changes</span>
    </button>
  </div>
);

const NotificationSettings = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-800">Email Notifications</p>
          <p className="text-sm text-gray-600">Receive email updates about ranking changes</p>
        </div>
        <input type="checkbox" defaultChecked className="toggle" />
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-800">Weekly Reports</p>
          <p className="text-sm text-gray-600">Get weekly performance summaries</p>
        </div>
        <input type="checkbox" defaultChecked className="toggle" />
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-800">Alert Notifications</p>
          <p className="text-sm text-gray-600">Get notified of significant ranking changes</p>
        </div>
        <input type="checkbox" className="toggle" />
      </div>
    </div>
  </div>
);

const APISettings = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800">API Configuration</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps API Key</label>
        <input
          type="password"
          placeholder="Enter your Google Maps API key"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Console API Key</label>
        <input
          type="password"
          placeholder="Enter your Search Console API key"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
      <SafeIcon icon={FiSave} />
      <span>Save API Keys</span>
    </button>
  </div>
);

const LocationSettings = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800">Default Location Settings</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Default Search Radius</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="25">25 miles</option>
          <option value="50">50 miles</option>
          <option value="100" selected>100 miles</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Business Location</label>
        <input
          type="text"
          placeholder="Enter your primary business address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  </div>
);

const GeneralSettings = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Eastern Time (ET)</option>
          <option>Central Time (CT)</option>
          <option>Mountain Time (MT)</option>
          <option>Pacific Time (PT)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>MM/DD/YYYY</option>
          <option>DD/MM/YYYY</option>
          <option>YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  </div>
);

export default Settings;