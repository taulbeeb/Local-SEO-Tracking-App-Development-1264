import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import KeywordTracking from './pages/KeywordTracking';
import LocationTracking from './pages/LocationTracking';
import Rankings from './pages/Rankings';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Clients from './pages/Clients';
import AddClient from './components/AddClient';
import ClientSettings from './pages/ClientSettings';
import { AuthProvider } from './context/AuthContext';
import { ClientProvider } from './context/ClientContext';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <AuthProvider>
        <ClientProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={<AppLayout isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />} />
          </Routes>
        </ClientProvider>
      </AuthProvider>
    </Router>
  );
}

// Separate layout component for authenticated pages
function AppLayout({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/keywords" element={<KeywordTracking />} />
              <Route path="/locations" element={<LocationTracking />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/add" element={<AddClient />} />
              <Route path="/clients/:clientId/settings" element={<ClientSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;