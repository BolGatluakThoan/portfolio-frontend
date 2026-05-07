import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminLoginButton from './AdminLoginButton';
import api from '../services/api';

const Layout = () => {
  const { theme } = useTheme();
  const [settings, setSettings] = useState({});
  const location = useLocation();
  
  // Check if current route is login page
  const isLoginPage = location.pathname === '/admin/login';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Only show Navbar if not on login page */}
      {!isLoginPage && <Navbar />}
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={!isLoginPage ? "container-custom py-8 md:py-12" : ""}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Only show Footer if not on login page */}
      {!isLoginPage && <Footer />}
      {!isLoginPage && <AdminLoginButton />}
    </div>
  );
};

export default Layout;