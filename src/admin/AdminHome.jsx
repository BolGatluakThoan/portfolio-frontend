import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  FiFolder,
  FiBookOpen,
  FiCode,
  FiMail,
  FiSettings,
  FiTrendingUp,
  FiMessageSquare,
} from 'react-icons/fi';
import api from '../services/api';

const AdminHome = () => {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    skills: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      const [projectsRes, blogsRes, skillsRes, messagesRes] = await Promise.all([
        api.get('/projects'),
        api.get('/blogs/all'),
        api.get('/skills'),
        api.get('/messages'),
      ]);

      setStats({
        projects: projectsRes.data.length,
        blogs: blogsRes.data.length,
        skills: skillsRes.data.length,
        messages: messagesRes.data.length,
        unreadMessages: messagesRes.data.filter(m => !m.read).length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.projects,
      icon: <FiFolder size={24} />,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/projects',
    },
    {
      title: 'Total Blogs',
      value: stats.blogs,
      icon: <FiBookOpen size={24} />,
      color: 'from-green-500 to-green-600',
      link: '/admin/blogs',
    },
    {
      title: 'Skills',
      value: stats.skills,
      icon: <FiCode size={24} />,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/skills',
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: <FiMail size={24} />,
      color: 'from-yellow-500 to-yellow-600',
      link: '/admin/messages',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Welcome back, Admin!
        </h2>
        <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Here's what's happening with your content today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link to={card.link} className="block group">
              <div className={`p-5 sm:p-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                    {card.icon}
                  </div>
                  <FiTrendingUp className={`${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'} group-hover:text-green-500 transition-colors`} size={20} />
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {card.value}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {card.title}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {stats.unreadMessages > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            theme === 'dark'
              ? 'bg-yellow-900/20 border border-yellow-700'
              : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiMessageSquare className="text-yellow-600 dark:text-yellow-400" size={24} />
              <div>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'}`}>
                  You have {stats.unreadMessages} unread message{stats.unreadMessages !== 1 ? 's' : ''}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>
                  Check your messages to respond promptly
                </p>
              </div>
            </div>
            <Link
              to="/admin/messages"
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                theme === 'dark'
                  ? 'bg-yellow-700 text-white hover:bg-yellow-600'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              } transition-colors`}
            >
              View Messages
            </Link>
          </div>
        </motion.div>
      )}

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/admin/projects/new"
            className={`p-4 text-center rounded-lg transition-all hover:scale-105 ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-50 shadow'
            }`}
          >
            <FiFolder className="mx-auto mb-2 text-primary-600" size={24} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Add Project
            </span>
          </Link>
          <Link
            to="/admin/blogs/new"
            className={`p-4 text-center rounded-lg transition-all hover:scale-105 ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-50 shadow'
            }`}
          >
            <FiBookOpen className="mx-auto mb-2 text-primary-600" size={24} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Write Blog
            </span>
          </Link>
          <Link
            to="/admin/skills/new"
            className={`p-4 text-center rounded-lg transition-all hover:scale-105 ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-50 shadow'
            }`}
          >
            <FiCode className="mx-auto mb-2 text-primary-600" size={24} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Add Skill
            </span>
          </Link>
          <Link
            to="/admin/settings"
            className={`p-4 text-center rounded-lg transition-all hover:scale-105 ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-50 shadow'
            }`}
          >
            <FiSettings className="mx-auto mb-2 text-primary-600" size={24} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Settings
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;