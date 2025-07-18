import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useClient } from '../context/ClientContext';

const { FiArrowLeft, FiSave, FiUser, FiMail, FiPhone, FiGlobe, FiFileText } = FiIcons;

const AddClient = () => {
  // ... previous state declarations ...

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

      const { success, error, data } = await addClient(clientData);
      
      if (!success) {
        throw new Error(error || 'Failed to add client');
      }
      
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component code ...
};

export default AddClient;