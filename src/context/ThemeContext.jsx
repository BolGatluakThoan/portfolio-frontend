import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // changed default to dark
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        const savedTheme = data.theme || 'dark'; // changed fallback to dark
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Use system preference as fallback
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? 'dark' : 'light';
        setTheme(defaultTheme);
        applyTheme(defaultTheme);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Only save to server if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.put('/settings', { theme: newTheme });
      } catch (error) {
        console.log('Theme preference not saved to server');
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};