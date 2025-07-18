import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useClient } from '../context/ClientContext';

const { 
  FiArrowLeft, FiSave, FiUser, FiMail, FiPhone, FiGlobe, 
  FiFileText, FiUsers, FiKey, FiTrash2, FiSearch, FiBarChart2,
  FiMapPin // Added missing icon
} = FiIcons;

const ClientSettings = () => {
  // ... previous state declarations ...

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSaving(true);

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

      const { success, error } = await updateClient(clientId, clientData);
      
      if (!success) {
        throw new Error(error || 'Failed to update client');
      }
      
      setSuccessMessage('Client information updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ... rest of the component code ...
};

export default ClientSettings;