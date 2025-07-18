import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
        } else {
          // For demo purposes, create a demo user if no session exists
          setUser({ 
            id: 'demo-user', 
            email: 'demo@example.com', 
            full_name: 'Demo User' 
          });
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        // Still set a demo user on error
        setUser({ 
          id: 'demo-user', 
          email: 'demo@example.com', 
          full_name: 'Demo User' 
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          // For demo purposes, set to demo user instead of null
          setUser({ 
            id: 'demo-user', 
            email: 'demo@example.com', 
            full_name: 'Demo User' 
          });
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, fullName) => {
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      // If signup successful, create user profile
      if (authData && authData.user) {
        const { error: profileError } = await supabase
          .from('users_seo_87a5cd9f')
          .insert([
            {
              id: authData.user.id,
              email: email,
              full_name: fullName
            }
          ]);
        if (profileError) throw profileError;
      }

      return { success: true, data: authData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // For demo purposes, set to demo user instead of null
      setUser({ 
        id: 'demo-user', 
        email: 'demo@example.com', 
        full_name: 'Demo User' 
      });
      
      navigate('/login');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;