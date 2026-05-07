import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'
  const [message, setMessage] = useState('');
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      const { data } = await api.post('/newsletter/subscribe', { email, name });
      setStatus('success');
      setMessage(data.message);
      setEmail('');
      setName('');
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Something went wrong');
      setTimeout(() => setStatus(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
      <div className="text-center mb-4">
        <FiMail className="mx-auto mb-2 text-primary-600" size={28} />
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Subscribe to My Newsletter
        </h3>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Get the latest blog posts and updates delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
        />
        <input
          type="email"
          placeholder="Your email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <FiSend size={16} />
              Subscribe
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-3 p-2 rounded-lg text-sm flex items-center gap-2 ${
              status === 'success'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}
          >
            {status === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <p className={`text-xs text-center mt-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        No spam, unsubscribe anytime.
      </p>
    </div>
  );
};

export default Newsletter;