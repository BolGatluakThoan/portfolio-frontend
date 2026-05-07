import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiCheckCircle, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';

const MessagesView = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/messages');
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      fetchMessages();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/messages/${id}`);
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
        fetchMessages();
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-6">
      {/* Messages List */}
      <div className={`w-full ${selectedMessage ? 'lg:w-1/2' : 'w-full'} transition-all`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Messages ({messages.length})
        </h2>
        
        {messages.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <FiMail size={48} className="mx-auto mb-4 opacity-50" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedMessage?._id === message._id
                      ? 'ring-2 ring-primary-500'
                      : ''
                  } ${
                    theme === 'dark'
                      ? message.read
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-gray-700 border-l-4 border-primary-500'
                      : message.read
                      ? 'bg-white hover:bg-gray-50'
                      : 'bg-blue-50 border-l-4 border-primary-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {message.name}
                        </h3>
                        {!message.read && (
                          <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {message.subject}
                      </p>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!message.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(message._id);
                          }}
                          className={`p-2 rounded-lg transition ${
                            theme === 'dark'
                              ? 'hover:bg-gray-600 text-green-400'
                              : 'hover:bg-gray-200 text-green-600'
                          }`}
                          title="Mark as read"
                        >
                          <FiEye size={16} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message._id);
                        }}
                        className={`p-2 rounded-lg transition ${
                          theme === 'dark'
                            ? 'hover:bg-gray-600 text-red-400'
                            : 'hover:bg-gray-200 text-red-600'
                        }`}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Message Detail */}
      {selectedMessage && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className={`hidden lg:block w-1/2 rounded-lg p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg sticky top-6`}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Message Details
            </h3>
            <div className="flex gap-2">
              {!selectedMessage.read && (
                <button
                  onClick={() => handleMarkAsRead(selectedMessage._id)}
                  className={`p-2 rounded-lg transition ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-green-400'
                      : 'hover:bg-gray-100 text-green-600'
                  }`}
                  title="Mark as read"
                >
                  <FiCheckCircle size={20} />
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className={`p-2 rounded-lg transition ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-red-400'
                    : 'hover:bg-gray-100 text-red-600'
                }`}
                title="Delete"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                From
              </label>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {selectedMessage.name}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedMessage.email}
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Subject
              </label>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {selectedMessage.subject}
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Date
              </label>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Message
              </label>
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile Message Detail */}
      {selectedMessage && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-lg max-w-md w-full p-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Message Details
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  From
                </label>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedMessage.name}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedMessage.email}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Subject
                </label>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedMessage.subject}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Message
                </label>
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className={`whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {!selectedMessage.read && (
                  <button
                    onClick={() => handleMarkAsRead(selectedMessage._id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;