import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  FiHome,
  FiFolder,
  FiBookOpen,
  FiCode,
  FiMail,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiGrid,
  FiUser,
  FiCompass,
  FiFileText,
  FiUserCheck,
  FiSun,
  FiMoon,
  FiUsers,
  FiEye
} from 'react-icons/fi';
import api from '../services/api';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin/login');
          return;
        }
        
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [navigate]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { label: 'Dashboard', to: '', icon: <FiHome size={20} /> },
    { label: 'Projects', to: 'projects', icon: <FiFolder size={20} /> },
    { label: 'Blogs', to: 'blogs', icon: <FiBookOpen size={20} /> },
    { label: 'Skills', to: 'skills', icon: <FiCode size={20} /> },
    { label: 'Messages', to: 'messages', icon: <FiMail size={20} /> },
    { label: 'Newsletter', to: 'newsletter', icon: <FiMail size={20} /> },
    { label: 'Visitor Stats', to: 'visitors', icon: <FiEye size={20} /> },
    { label: 'Profile', to: 'profile', icon: <FiUser size={20} /> },
    { label: 'Settings', to: 'settings', icon: <FiSettings size={20} /> },
    { label: 'Navbar', to: 'navbar', icon: <FiCompass size={20} /> },
    { label: 'Hero', to: 'hero', icon: <FiUser size={20} /> },
    { label: 'About', to: 'about', icon: <FiUserCheck size={20} /> },
    { label: 'Contact', to: 'contact', icon: <FiMail size={20} /> },
    { label: 'Resume', to: 'resume', icon: <FiFileText size={20} /> },
    { label: 'Email Templates', to: 'email-templates', icon: <FiMail size={20} /> },
    { label: 'Users', to: 'users', icon: <FiUsers size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  // Get profile picture URL
  const getProfilePicture = () => {
    if (!user?.avatar?.value) return null;
    return user.avatar.value;
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${isMobile ? 'fixed' : 'relative'}
          bg-gradient-to-b from-gray-900 to-gray-800 text-white
          flex flex-col transition-all duration-300 shadow-xl
          z-50 h-full
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <FiGrid className="text-primary-400" size={24} />
            <h2 className={`font-bold text-lg ${sidebarOpen ? 'block' : 'hidden'}`}>CMS Admin</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ''}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${!sidebarOpen && 'justify-center'}`
              }
            >
              {item.icon}
              <span className={sidebarOpen ? 'block' : 'hidden'}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all"
          >
            <FiLogOut size={20} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`shadow-sm px-4 sm:px-6 py-4 flex justify-between items-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiMenu size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
              </button>
            )}
            <h1 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            
            {/* Profile Picture and Name */}
            <div className="flex items-center gap-2">
              {getProfilePicture() ? (
                <img
                  src={getProfilePicture()}
                  alt={user?.name || 'Admin'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <FiUser size={16} className="text-white" />
                </div>
              )}
              <span className={`text-sm font-medium hidden sm:inline ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {loading ? 'Loading...' : (user?.name || 'Admin')}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;