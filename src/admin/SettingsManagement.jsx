import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiSave, FiRefreshCw, FiKey, FiClock, FiEye, FiEyeOff, 
  FiUpload, FiImage, FiTrash2, FiCheckCircle
} from 'react-icons/fi';
import api from '../services/api';

const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    theme: 'light',
    logo: { type: 'text', value: '' },
    favicon: { type: 'url', value: '' },
    autoReplyEnabled: true,
    autoReplyMessage: '',
    adminEmail: '',
    googleAnalyticsId: '',
    adminShortcut: {
      enabled: true,
      key: 'a',
      presses: 3,
      timeout: 1000,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showShortcutPreview, setShowShortcutPreview] = useState(false);
  const { theme: appTheme } = useTheme();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    
    try {
      await api.put('/settings', settings);
      setSuccess('Settings saved successfully!');
      
      // Reload page to apply theme changes if needed
      if (settings.theme !== (window.localStorage.getItem('theme') || 'light')) {
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
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
      setSettings({
        ...settings,
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
    setSettings({
      ...settings,
      logo: { type: 'text', value: '' }
    });
    setSuccess('Logo removed');
    setTimeout(() => setSuccess(''), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className={`text-2xl font-bold ${appTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          General Settings
        </h2>
        <button
          onClick={fetchSettings}
          className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition"
        >
          <FiRefreshCw size={18} />
          Reset
        </button>
      </div>

      {/* Success Message */}
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
          <FiCheckCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Information */}
        <div className={`rounded-lg p-4 sm:p-6 ${appTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${appTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Site Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Site Title *
              </label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  appTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Site Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows="3"
                className={`w-full px-3 py-2 rounded-lg border ${
                  appTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Logo & Branding */}
        <div className={`rounded-lg p-4 sm:p-6 ${appTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${appTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Logo & Branding
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Logo Type
              </label>
              <select
                value={settings.logo.type}
                onChange={(e) => setSettings({ ...settings, logo: { ...settings.logo, type: e.target.value } })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  appTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="text">Text</option>
                <option value="url">URL</option>
                <option value="upload">Uploaded Image</option>
              </select>
            </div>
            
            {settings.logo.type === 'text' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Logo Text
                </label>
                <input
                  type="text"
                  value={settings.logo.value}
                  onChange={(e) => setSettings({ ...settings, logo: { ...settings.logo, value: e.target.value } })}
                  placeholder="Enter logo text"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    appTheme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}
            
            {settings.logo.type === 'url' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Logo URL
                </label>
                <input
                  type="url"
                  value={settings.logo.value}
                  onChange={(e) => setSettings({ ...settings, logo: { ...settings.logo, value: e.target.value } })}
                  placeholder="https://example.com/logo.png"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    appTheme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}
            
            {settings.logo.type === 'upload' && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Upload Logo Image
                  </label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      appTheme === 'dark'
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
                    {settings.logo.value && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                      >
                        <FiTrash2 size={18} />
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs mt-2 text-gray-500">Supports JPG, PNG, GIF, WebP up to 5MB</p>
                </div>
                
                {settings.logo.value && (
                  <div className="mt-4">
                    <p className={`text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Current Logo:
                    </p>
                    <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700/50 inline-block">
                      <img
                        src={settings.logo.value}
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

        {/* Admin Access Settings */}
        <div className={`rounded-lg p-4 sm:p-6 ${appTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${appTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            <FiKey size={20} />
            Admin Access Settings
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.adminShortcut?.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  adminShortcut: {
                    ...settings.adminShortcut,
                    enabled: e.target.checked
                  }
                })}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className={appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Enable Secret Admin Shortcut
              </span>
            </label>
            
            {settings.adminShortcut?.enabled && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Shortcut Key
                    </label>
                    <input
                      type="text"
                      value={settings.adminShortcut?.key || 'a'}
                      onChange={(e) => setSettings({
                        ...settings,
                        adminShortcut: {
                          ...settings.adminShortcut,
                          key: e.target.value.toLowerCase()
                        }
                      })}
                      maxLength="1"
                      className={`w-full px-3 py-2 rounded-lg border text-center text-lg font-mono ${
                        appTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <p className="text-xs mt-1 text-gray-500">Single character (a-z)</p>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Number of Presses
                    </label>
                    <input
                      type="number"
                      value={settings.adminShortcut?.presses || 3}
                      onChange={(e) => setSettings({
                        ...settings,
                        adminShortcut: {
                          ...settings.adminShortcut,
                          presses: parseInt(e.target.value)
                        }
                      })}
                      min="2"
                      max="10"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        appTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <p className="text-xs mt-1 text-gray-500">How many times to press</p>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Timeout (ms)
                    </label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        value={settings.adminShortcut?.timeout || 1000}
                        onChange={(e) => setSettings({
                          ...settings,
                          adminShortcut: {
                            ...settings.adminShortcut,
                            timeout: parseInt(e.target.value)
                          }
                        })}
                        min="500"
                        max="3000"
                        step="100"
                        className={`w-full pl-9 pr-3 py-2 rounded-lg border ${
                          appTheme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <p className="text-xs mt-1 text-gray-500">Time window to complete presses</p>
                  </div>
                </div>
                
                <div className={`mt-4 p-4 rounded-lg ${appTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} border ${appTheme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {showShortcutPreview ? (
                        <FiEyeOff size={18} className="text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => setShowShortcutPreview(false)} />
                      ) : (
                        <FiEye size={18} className="text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => setShowShortcutPreview(true)} />
                      )}
                      <span className={`text-sm ${appTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        How it works:
                      </span>
                    </div>
                    {showShortcutPreview && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-500">Press</span>
                        <kbd className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm font-mono font-bold shadow-sm">
                          {settings.adminShortcut?.key?.toUpperCase() || 'A'}
                        </kbd>
                        <span className="text-sm text-gray-500">{settings.adminShortcut?.presses || 3} times within</span>
                        <kbd className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm font-mono">
                          {settings.adminShortcut?.timeout || 1000}ms
                        </kbd>
                        <span className="text-sm text-gray-500">to access admin login</span>
                      </div>
                    )}
                  </div>
                  {!showShortcutPreview && (
                    <p className={`text-sm mt-2 ${appTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      💡 <strong>Secret Admin Access:</strong> Press the <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs font-mono">{settings.adminShortcut?.key?.toUpperCase() || 'A'}</kbd> key {settings.adminShortcut?.presses || 3} times within {settings.adminShortcut?.timeout || 1000}ms to access the admin login page.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Auto-Reply Settings */}
        <div className={`rounded-lg p-4 sm:p-6 ${appTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${appTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Auto-Reply Settings
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoReplyEnabled}
                onChange={(e) => setSettings({ ...settings, autoReplyEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className={appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Enable Auto-Reply for Contact Messages
              </span>
            </label>
            
            {settings.autoReplyEnabled && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Auto-Reply Message
                </label>
                <textarea
                  value={settings.autoReplyMessage}
                  onChange={(e) => setSettings({ ...settings, autoReplyMessage: e.target.value })}
                  rows="4"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    appTheme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Thank you for reaching out! I will get back to you soon."
                />
              </div>
            )}
          </div>
        </div>

        {/* Admin & Analytics */}
        <div className={`rounded-lg p-4 sm:p-6 ${appTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${appTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Admin & Analytics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Admin Email (for notifications)
              </label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  appTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="admin@example.com"
              />
              <p className="text-xs mt-1 text-gray-500">Where you'll receive contact form notifications</p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${appTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Google Analytics ID
              </label>
              <input
                type="text"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  appTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="G-XXXXXXXX"
              />
              <p className="text-xs mt-1 text-gray-500">Paste your Google Analytics Measurement ID (starts with G-)</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end sticky bottom-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-700 transition disabled:opacity-50 shadow-lg"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave size={18} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManagement;