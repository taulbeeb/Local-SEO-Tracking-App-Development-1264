import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabase';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        console.log("Fetching clients...");
        
        // For demo/development, fetch all clients from the database
        const { data, error } = await supabase
          .from('clients_seo_87a5cd9f')
          .select('*');
        
        if (error) {
          console.error("Error fetching clients:", error);
          throw error;
        }
        
        console.log("Clients fetched:", data);
        setClients(data || []);
        
        // Set current client to the first one if none is selected
        if (data && data.length > 0 && !currentClient) {
          setCurrentClient(data[0]);
          localStorage.setItem('currentClientId', data[0].id);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchClients();
    
    // Set up a real-time subscription to the clients table
    const clientsSubscription = supabase
      .channel('clients_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients_seo_87a5cd9f' }, 
        (payload) => {
          console.log('Change received!', payload);
          fetchClients();
        }
      )
      .subscribe();
      
    return () => {
      clientsSubscription.unsubscribe();
    };
  }, []);

  // Load previously selected client from localStorage
  useEffect(() => {
    if (clients.length > 0) {
      const savedClientId = localStorage.getItem('currentClientId');
      if (savedClientId) {
        const savedClient = clients.find(client => client.id === savedClientId);
        if (savedClient) {
          setCurrentClient(savedClient);
        }
      }
    }
  }, [clients]);

  const switchClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setCurrentClient(client);
      localStorage.setItem('currentClientId', clientId);
    }
  };

  const addClient = async (clientData) => {
    try {
      console.log("Adding client to context:", clientData);
      
      // Update local state with the new client
      setClients(prev => [...prev, clientData]);
      
      // Switch to new client
      setCurrentClient(clientData);
      localStorage.setItem('currentClientId', clientData.id);

      return { success: true, data: clientData };
    } catch (error) {
      console.error('Error adding client to context:', error);
      return { success: false, error: error.message };
    }
  };

  const updateClient = async (clientId, updates) => {
    try {
      const { data, error } = await supabase
        .from('clients_seo_87a5cd9f')
        .update(updates)
        .eq('id', clientId)
        .select();

      if (error) throw error;

      // Update local state
      const updatedClient = data[0];
      setClients(prev => 
        prev.map(client => 
          client.id === clientId ? { ...client, ...updatedClient } : client
        )
      );

      // Update current client if it's the one being updated
      if (currentClient && currentClient.id === clientId) {
        setCurrentClient(prev => ({ ...prev, ...updatedClient }));
      }

      return { success: true, data: updatedClient };
    } catch (error) {
      console.error('Error updating client:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteClient = async (clientId) => {
    try {
      // Delete client
      const { error } = await supabase
        .from('clients_seo_87a5cd9f')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      // Update local state
      setClients(prev => prev.filter(client => client.id !== clientId));

      // If current client is deleted, switch to another
      if (currentClient && currentClient.id === clientId) {
        if (clients.length > 1) {
          const newCurrentClient = clients.find(client => client.id !== clientId);
          setCurrentClient(newCurrentClient);
          localStorage.setItem('currentClientId', newCurrentClient.id);
        } else {
          setCurrentClient(null);
          localStorage.removeItem('currentClientId');
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting client:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    clients,
    currentClient,
    loading,
    switchClient,
    addClient,
    updateClient,
    deleteClient
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

export default ClientContext;