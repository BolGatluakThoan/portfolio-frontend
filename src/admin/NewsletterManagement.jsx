import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiUsers, FiSend, FiDownload, FiTrash2, FiCheckCircle, FiLink } from 'react-icons/fi';
import api from '../services/api';

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ activeCount: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [newsletterData, setNewsletterData] = useState({ subject: '', content: '', blogUrl: '' });
  const [success, setSuccess] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data } = await api.get('/newsletter/subscribers');
      setSubscribers(data.subscribers);
      setStats({ activeCount: data.activeCount, totalCount: data.totalCount });
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/newsletter/send', newsletterData);
      setSuccess(`Newsletter sent to ${data.count} subscribers!`);
      setTimeout(() => setSuccess(''), 3000);
      setShowSendModal(false);
      setNewsletterData({ subject: '', content: '', blogUrl: '' });
    } catch (error) {
      console.error('Failed to send newsletter:', error);
    } finally {
      setSending(false);
    }
  };

  const exportSubscribers = () => {
    const csv = subscribers.map(s => `${s.email},${s.name || ''},${s.status},${new Date(s.subscribedAt).toLocaleDateString()}`).join('\n');
    const blob = new Blob([`Email,Name,Status,Subscribed Date\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Newsletter Management
        </h2>
        <div className="flex gap-3">
          <button
            onClick={exportSubscribers}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition"
          >
            <FiDownload size={18} />
            Export CSV
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 hover:bg-primary-700 transition"
          >
            <FiSend size={18} />
            Send Newsletter
          </button>
        </div>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2"
        >
          <FiCheckCircle size={18} />
          {success}
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center gap-3 mb-2">
            <FiUsers size={24} className="text-primary-600" />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Active Subscribers
            </h3>
          </div>
          <p className="text-3xl font-bold text-primary-600">{stats.activeCount}</p>
        </div>
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center gap-3 mb-2">
            <FiMail size={24} className="text-primary-600" />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Total Subscribers
            </h3>
          </div>
          <p className="text-3xl font-bold text-primary-600">{stats.totalCount}</p>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Subscribers List
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Email</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Name</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Subscribed Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{subscriber.email}</td>
                  <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{subscriber.name || '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subscriber.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{new Date(subscriber.subscribedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Newsletter Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSendModal(false)}>
          <div className={`max-w-2xl w-full rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`} onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Send Newsletter
              </h3>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                This will be sent to {stats.activeCount} active subscribers
              </p>
            </div>
            <form onSubmit={handleSendNewsletter} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  value={newsletterData.subject}
                  onChange={(e) => setNewsletterData({ ...newsletterData, subject: e.target.value })}
                  required
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="New Blog Post: The Art of Clean Code"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Content (HTML supported)
                </label>
                <textarea
                  value={newsletterData.content}
                  onChange={(e) => setNewsletterData({ ...newsletterData, content: e.target.value })}
                  rows="6"
                  required
                  className={`w-full px-3 py-2 rounded-lg border font-mono text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="<h2>Exciting New Content!</h2><p>Check out my latest blog post...</p>"
                />
              </div>
              
              {/* NEW: Blog URL Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FiLink className="inline mr-1" size={14} />
                  Blog Post URL (for the "Read More" button)
                </label>
                <input
                  type="url"
                  value={newsletterData.blogUrl}
                  onChange={(e) => setNewsletterData({ ...newsletterData, blogUrl: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="https://yourdomain.com/blog/my-awesome-post"
                />
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add the full URL to your blog post. The button will link directly to it.
                </p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <FiSend size={18} />
                  )}
                  Send Newsletter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterManagement;