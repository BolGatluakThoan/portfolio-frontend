import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiMenu, 
  FiX, 
  FiMoon, 
  FiSun, 
  FiDownload, 
  FiHome,
  FiFolder,
  FiBookOpen,
  FiMail
} from 'react-icons/fi';
import api from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbar, setNavbar] = useState(null);
  const [settings, setSettings] = useState(null);
  const [resume, setResume] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [navbarRes, settingsRes, resumeRes] = await Promise.all([
          api.get('/navbar'),
          api.get('/settings'),
          api.get('/resume'),
        ]);
        setNavbar(navbarRes.data);
        setSettings(settingsRes.data);
        setResume(resumeRes.data);
      } catch (error) {
        console.error('Failed to fetch navbar data:', error);
      }
    };
    fetchData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret admin shortcut - FIXED
  useEffect(() => {
    if (!settings) return;
    const { adminShortcut } = settings;
    if (!adminShortcut?.enabled) return;

    let pressCount = 0;
    let timeout;
    
    const handleKeyPress = (e) => {
      // Safety check - make sure e.key exists
      if (!e || !e.key) return;
      
      const shortcutKey = adminShortcut.key || 'a';
      // Convert both to lowercase safely
      const pressedKey = e.key.toLowerCase();
      const targetKey = shortcutKey.toLowerCase();
      
      if (pressedKey === targetKey) {
        pressCount++;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          pressCount = 0;
        }, adminShortcut.timeout || 1000);
        
        if (pressCount === (adminShortcut.presses || 3)) {
          window.location.href = '/admin/login';
          pressCount = 0;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [settings]);

  const getLogo = () => {
    const logo = navbar?.logo;
    
    if (!logo || !logo.value) {
      return <span className="text-2xl font-bold">Portfolio</span>;
    }
    
    if (logo.type === 'text') {
      return (
        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          {logo.value}
        </span>
      );
    }
    
    if (logo.type === 'url' || logo.type === 'upload') {
      return (
        <img 
          src={logo.value} 
          alt="Logo" 
          className="h-10 w-10 rounded-full object-cover border-2 border-primary-500 shadow-md"
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            if (parent) {
              const textSpan = document.createElement('span');
              textSpan.className = 'text-2xl font-bold';
              textSpan.textContent = 'Portfolio';
              parent.appendChild(textSpan);
            }
          }}
        />
      );
    }
    
    return <span className="text-2xl font-bold">Portfolio</span>;
  };

  // Create menu items with proper JSX elements
  const menuItems = (navbar?.menu && navbar.menu.length > 0) 
    ? navbar.menu.map(item => ({
        ...item,
        icon: item.path === '/' ? <FiHome size={18} /> :
              item.path === '/projects' ? <FiFolder size={18} /> :
              item.path === '/blog' ? <FiBookOpen size={18} /> :
              item.path === '/contact' ? <FiMail size={18} /> :
              <FiHome size={18} />
      }))
    : [
        { name: 'Home', path: '/', icon: <FiHome size={18} /> },
        { name: 'Projects', path: '/projects', icon: <FiFolder size={18} /> },
        { name: 'Blog', path: '/blog', icon: <FiBookOpen size={18} /> },
        { name: 'Contact', path: '/contact', icon: <FiMail size={18} /> },
      ];

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? theme === 'dark'
              ? 'bg-gray-900/95 backdrop-blur-md shadow-lg'
              : 'bg-white/95 backdrop-blur-md shadow-lg'
            : theme === 'dark'
            ? 'bg-gray-900/80 backdrop-blur-sm'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" onClick={closeMobileMenu} className="flex-shrink-0">
              {getLogo()}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.name}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {resume?.fileUrl && resume.fileUrl !== '#' && (
                <motion.a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiDownload size={16} className="group-hover:animate-bounce" />
                  <span>Resume</span>
                </motion.a>
              )}

              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              {resume?.fileUrl && resume.fileUrl !== '#' && (
                <motion.a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-primary-600 text-white"
                  whileTap={{ scale: 0.95 }}
                >
                  <FiDownload size={20} />
                </motion.a>
              )}

              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-yellow-400'
                    : 'bg-gray-100 text-gray-700'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </motion.button>

              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden overflow-hidden ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              } border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <div className="px-4 py-4 space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.name}
                    </span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;