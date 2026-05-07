import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiAlertCircle, FiCheckCircle, FiHome } from 'react-icons/fi';
import api from '../services/api';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'notfound'
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeUser = async () => {
      if (!email) {
        setStatus('notfound');
        setMessage('No email address provided.');
        return;
      }

      try {
        const { data } = await api.post('/newsletter/unsubscribe', { email });
        setStatus('success');
        setMessage(data.message);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Something went wrong';
        
        // Check if it's a 404 (email not found) or already unsubscribed
        if (error.response?.status === 404 || errorMsg === 'Email not found') {
          setStatus('notfound');
          setMessage('This email address was not found in our subscriber list.');
        } else {
          setStatus('error');
          setMessage(errorMsg);
        }
      }
    };

    unsubscribeUser();
  }, [email]);

  // 404 Page Component
  if (status === 'notfound') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`max-w-md w-full rounded-2xl p-8 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FiAlertCircle size={40} className="text-red-600 dark:text-red-400" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            404 - Not Found
          </h1>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {message || 'The email address you are trying to unsubscribe was not found in our system.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <FiHome size={18} />
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  // Success Page
  if (status === 'success') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`max-w-md w-full rounded-2xl p-8 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <FiCheckCircle size={40} className="text-green-600 dark:text-green-400" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Successfully Unsubscribed
          </h1>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {message || 'You have been unsubscribed from our newsletter.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <FiHome size={18} />
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  // Error Page
  if (status === 'error') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`max-w-md w-full rounded-2xl p-8 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FiAlertCircle size={40} className="text-red-600 dark:text-red-400" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Error
          </h1>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {message || 'Something went wrong. Please try again later.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <FiHome size={18} />
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  // Loading state
  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default Unsubscribe;