import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock } from 'react-icons/fi';

const AdminLoginButton = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAdmin(!!token);

    // Hide button after 5 seconds on scroll
    let timeout;
    const handleScroll = () => {
      setIsVisible(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsVisible(true), 3000);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Link
            to="/admin/login"
            className="group flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700"
            aria-label="Login"
          >
            <FiLock size={16} className="group-hover:scale-110 transition-transform" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginButton;