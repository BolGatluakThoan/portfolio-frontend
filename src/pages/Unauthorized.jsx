import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiHome, FiLock } from 'react-icons/fi';

const Unauthorized = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center">
        <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
          <FiLock size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Access Restricted
        </h1>
        <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          You don't have permission to access this page.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiHome size={20} />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;