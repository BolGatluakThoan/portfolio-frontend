import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiUsers, FiUserCheck, FiCalendar, FiTrendingUp, 
  FiEye, FiGlobe, FiMonitor, FiSmartphone, FiRefreshCw,
  FiTrash2, FiAlertCircle
} from 'react-icons/fi';
import api from '../services/api';

const VisitorStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/visitors/stats');
      setStats(data.stats);
      setError('');
    } catch (error) {
      console.error('Failed to fetch visitor stats:', error);
      setError('Failed to load visitor statistics');
    } finally {
      setLoading(false);
    }
  };

  const clearAllVisitors = async () => {
    setClearing(true);
    try {
      await api.delete('/visitors/clear');
      setShowConfirm(false);
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Failed to clear visitors:', error);
      setError('Failed to clear visitor data');
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Visitors',
      value: stats?.totalVisitors || 0,
      icon: <FiUsers size={24} />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Today\'s Visitors',
      value: stats?.todayVisitors || 0,
      icon: <FiCalendar size={24} />,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'This Week',
      value: stats?.weekVisitors || 0,
      icon: <FiTrendingUp size={24} />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Unique Visitors',
      value: stats?.uniqueVisitors || 0,
      icon: <FiUserCheck size={24} />,
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Visitor Statistics
        </h2>
        <div className="flex gap-3">
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition"
          >
            <FiRefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
          >
            <FiTrash2 size={18} />
            Clear All
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
            <div className="flex items-center gap-3 mb-4">
              <FiAlertCircle size={28} className="text-red-500" />
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Clear All Visitor Data?
              </h3>
            </div>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              This action cannot be undone. All visitor statistics will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={clearAllVisitors}
                disabled={clearing}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
              >
                {clearing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Clearing...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    Yes, Clear All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
          <FiAlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white inline-block mb-4`}>
              {card.icon}
            </div>
            <h3 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {card.value.toLocaleString()}
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {card.title}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Top Pages */}
      <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Most Visited Pages
        </h3>
        <div className="space-y-3">
          {stats?.topPages?.length > 0 ? (
            stats.topPages.map((page, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {page._id === '/' ? '🏠 Home' : page._id === '/projects' ? '📁 Projects' : 
                   page._id === '/blog' ? '📝 Blog' : page._id === '/contact' ? '📧 Contact' : page._id}
                </span>
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {page.count} views
                </span>
              </div>
            ))
          ) : (
            <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No page visits recorded yet
            </p>
          )}
        </div>
      </div>

      {/* Recent Visitors */}
      <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Recent Visitors
        </h3>
        <div className="overflow-x-auto">
          {stats?.recentVisitors?.length > 0 ? (
            <table className="w-full">
              <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className="px-4 py-2 text-left text-sm">Page</th>
                  <th className="px-4 py-2 text-left text-sm">Time</th>
                  <th className="px-4 py-2 text-left text-sm">Device</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentVisitors.slice(0, 10).map((visitor, idx) => (
                  <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 text-sm">
                      {visitor.page === '/' ? '🏠 Home' : 
                       visitor.page === '/projects' ? '📁 Projects' : 
                       visitor.page === '/blog' ? '📝 Blog' : 
                       visitor.page === '/contact' ? '📧 Contact' : visitor.page}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(visitor.visitedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {visitor.userAgent?.includes('Mobile') ? '📱 Mobile' : 
                       visitor.userAgent?.includes('Tablet') ? '📟 Tablet' : '💻 Desktop'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No recent visitors recorded
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorStats;