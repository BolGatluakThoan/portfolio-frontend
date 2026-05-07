import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import api from '../services/api';
import Newsletter from './Newsletter';

const Footer = () => {
  const { theme } = useTheme();
  const [contactInfo, setContactInfo] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactRes, settingsRes] = await Promise.all([
          api.get('/contact'),
          api.get('/settings'),
        ]);
        setContactInfo(contactRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      }
    };
    fetchData();
  }, []);

  const socialLinks = [
    { icon: FiGithub, url: contactInfo?.socials?.github, label: 'GitHub' },
    { icon: FiLinkedin, url: contactInfo?.socials?.linkedin, label: 'LinkedIn' },
    { icon: FiTwitter, url: contactInfo?.socials?.twitter, label: 'Twitter' },
    { icon: FiMail, url: `mailto:${contactInfo?.email}`, label: 'Email' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About */}
          <div className="lg:col-span-1">
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {settings?.siteTitle || 'Portfolio'}
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Building amazing web experiences with modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`text-sm hover:text-primary-600 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className={`text-sm hover:text-primary-600 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className={`text-sm hover:text-primary-600 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`text-sm hover:text-primary-600 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Contact
            </h3>
            <ul className="space-y-2">
              {contactInfo?.email && (
                <li className="flex items-center gap-2">
                  <FiMail className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={16} />
                  <a href={`mailto:${contactInfo.email}`} className={`text-sm hover:text-primary-600 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo?.phone && (
                <li className="flex items-center gap-2">
                  <FiPhone className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={16} />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {contactInfo.phone}
                  </span>
                </li>
              )}
              {contactInfo?.address && (
                <li className="flex items-center gap-2">
                  <FiMapPin className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={16} />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {contactInfo.address}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Follow Me
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                social.url && (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all hover:scale-110 ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-primary-600 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-primary-600 hover:text-white'
                    }`}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <Newsletter />
          </div>
        </div>

        <div className={`mt-8 pt-8 text-center border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            © {currentYear} {settings?.siteTitle || 'Portfolio'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;