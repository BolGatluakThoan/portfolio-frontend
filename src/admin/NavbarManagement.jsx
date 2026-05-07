import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiPlus, FiX, FiMove, FiSave, FiRefreshCw, FiUpload, 
  FiImage, FiTrash2 as FiTrashIcon, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import api from '../services/api';

const NavbarManagement = () => {
  const [navbar, setNavbar] = useState({
    logo: { type: 'text', value: '' },
    menu: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [newMenuItem, setNewMenuItem] = useState({ name: '', path: '' });
  const { theme } = useTheme();

  useEffect(() => {
    fetchNavbar();
  }, []);

  const fetchNavbar = async () => {
    try {
      const { data } = await api.get('/navbar');
      setNavbar(data);
    } catch (error) {
      console.error('Failed to fetch navbar:', error);
      setError('Failed to load navbar');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    setUploading(true);
    setError('');
    
    try {
      const { data } = await api.post('/upload/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNavbar({
        ...navbar,
        logo: { type: 'upload', value: data.value }
      });
      setSuccess('Logo uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = () => {
    setNavbar({
      ...navbar,
      logo: { type: 'text', value: '' }
    });
    setSuccess('Logo removed');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    
    try {
      await api.put('/navbar', navbar);
      setSuccess('Navbar settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save navbar:', error);
      setError('Failed to save navbar settings');
    } finally {
      setSaving(false);
    }
  };

  const addMenuItem = () => {
    if (newMenuItem.name && newMenuItem.path) {
      setNavbar({
        ...navbar,
        menu: [...navbar.menu, { ...newMenuItem }],
      });
      setNewMenuItem({ name: '', path: '' });
    }
  };

  const removeMenuItem = (index) => {
    setNavbar({
      ...navbar,
      menu: navbar.menu.filter((_, i) => i !== index),
    });
  };

  const updateMenuItem = (index, field, value) => {
    const updatedMenu = [...navbar.menu];
    updatedMenu[index][field] = value;
    setNavbar({ ...navbar, menu: updatedMenu });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Navigation Menu
        </h2>
        <button
          onClick={fetchNavbar}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition"
        >
          <FiRefreshCw size={18} />
          Reset
        </button>
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

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
          <FiAlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Logo Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Logo Type
              </label>
              <select
                value={navbar.logo.type}
                onChange={(e) => setNavbar({ ...navbar, logo: { ...navbar.logo, type: e.target.value } })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="text">Text</option>
                <option value="url">URL</option>
                <option value="upload">Uploaded Image</option>
              </select>
            </div>

            {navbar.logo.type === 'text' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Logo Text
                </label>
                <input
                  type="text"
                  value={navbar.logo.value}
                  onChange={(e) => setNavbar({ ...navbar, logo: { ...navbar.logo, value: e.target.value } })}
                  placeholder="Enter logo text"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}

            {navbar.logo.type === 'url' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Logo URL
                </label>
                <input
                  type="url"
                  value={navbar.logo.value}
                  onChange={(e) => setNavbar({ ...navbar, logo: { ...navbar.logo, value: e.target.value } })}
                  placeholder="https://example.com/logo.png"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}

            {navbar.logo.type === 'upload' && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FiImage className="inline mr-2" size={14} />
                    Upload Logo
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
                    <label className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <FiUpload size={18} />
                      {uploading ? 'Uploading...' : 'Choose Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {navbar.logo.value && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                      >
                        <FiTrashIcon size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs mt-2 text-gray-500">Supports JPG, PNG, GIF, WebP up to 5MB</p>
                </div>

                {navbar.logo.value && (
                  <div className="mt-4">
                    <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Preview:
                    </p>
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-4 inline-block bg-white dark:bg-gray-700">
                      <img
                        src={navbar.logo.value}
                        alt="Logo preview"
                        className="max-h-16 w-auto object-contain"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/200x100/e2e8f0/475569?text=Invalid+Image';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Menu Items
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                placeholder="Menu name (e.g., Home)"
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <input
                type="text"
                value={newMenuItem.path}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, path: e.target.value })}
                placeholder="Path (e.g., /)"
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <button
                type="button"
                onClick={addMenuItem}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
              >
                <FiPlus size={18} />
                Add
              </button>
            </div>
            
            <div className="space-y-2">
              <AnimatePresence>
                {navbar.menu.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <FiMove className="text-gray-400 cursor-move" size={20} />
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                      className={`flex-1 px-2 py-1 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    />
                    <input
                      type="text"
                      value={item.path}
                      onChange={(e) => updateMenuItem(index, 'path', e.target.value)}
                      className={`flex-1 px-2 py-1 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeMenuItem(index)}
                      className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <FiX size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave size={18} />
                Save Navbar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NavbarManagement;