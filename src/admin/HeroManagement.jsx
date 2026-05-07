import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiPlus, 
  FiX, 
  FiSave, 
  FiRefreshCw, 
  FiUpload, 
  FiType,
  FiSettings 
} from 'react-icons/fi';
import api from '../services/api';

const HeroManagement = () => {
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    description: '',
    typewriter: {
      enabled: false,
      strings: [],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
    },
    ctaButtons: [],
    image: { type: 'url', value: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [newButton, setNewButton] = useState({ text: '', link: '', variant: 'primary' });
  const [newTypewriterString, setNewTypewriterString] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const { theme } = useTheme();

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const { data } = await api.get('/hero');
      setHero(data);
    } catch (error) {
      console.error('Failed to fetch hero:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    
    try {
      await api.put('/hero', hero);
      setSuccess('Hero section updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save hero:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    setUploading(true);
    try {
      const { data } = await api.post('/upload/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHero({
        ...hero,
        image: { type: 'upload', value: data.value }
      });
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const addButton = () => {
    if (newButton.text && newButton.link) {
      setHero({
        ...hero,
        ctaButtons: [...hero.ctaButtons, { ...newButton }],
      });
      setNewButton({ text: '', link: '', variant: 'primary' });
    }
  };

  const removeButton = (index) => {
    setHero({
      ...hero,
      ctaButtons: hero.ctaButtons.filter((_, i) => i !== index),
    });
  };

  const updateButton = (index, field, value) => {
    const updatedButtons = [...hero.ctaButtons];
    updatedButtons[index][field] = value;
    setHero({ ...hero, ctaButtons: updatedButtons });
  };

  const addTypewriterString = () => {
    if (newTypewriterString.trim()) {
      setHero({
        ...hero,
        typewriter: {
          ...hero.typewriter,
          strings: [...(hero.typewriter?.strings || []), newTypewriterString.trim()]
        }
      });
      setNewTypewriterString('');
    }
  };

  const removeTypewriterString = (index) => {
    setHero({
      ...hero,
      typewriter: {
        ...hero.typewriter,
        strings: hero.typewriter.strings.filter((_, i) => i !== index)
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Hero Section
        </h2>
        <button
          onClick={fetchHero}
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
          className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg"
        >
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'basic'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Basic Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('typewriter')}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'typewriter'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiType size={16} />
            Typewriter Effect
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('buttons')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'buttons'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Buttons
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'image'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Image
          </button>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Title *
                </label>
                <input
                  type="text"
                  value={hero.title}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Hi, I'm"
                  required
                />
                <p className="text-xs mt-1 text-gray-500">Your greeting/name prefix</p>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subtitle (Static - used if typewriter is disabled)
                </label>
                <input
                  type="text"
                  value={hero.subtitle}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Creative Developer"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description *
                </label>
                <textarea
                  value={hero.description}
                  onChange={(e) => setHero({ ...hero, description: e.target.value })}
                  rows="4"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Typewriter Tab */}
        {activeTab === 'typewriter' && (
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hero.typewriter?.enabled || false}
                  onChange={(e) => setHero({
                    ...hero,
                    typewriter: { ...hero.typewriter, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 rounded"
                />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  Enable Typewriter Effect
                </span>
              </label>

              {hero.typewriter?.enabled && (
                <>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Typewriter Strings
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newTypewriterString}
                        onChange={(e) => setNewTypewriterString(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTypewriterString())}
                        placeholder="e.g., Software Engineer"
                        className={`flex-1 px-3 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={addTypewriterString}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {hero.typewriter?.strings?.map((str, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>"{str}"</span>
                          <button
                            type="button"
                            onClick={() => removeTypewriterString(idx)}
                            className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Type Speed (ms)
                      </label>
                      <input
                        type="number"
                        value={hero.typewriter.typeSpeed || 50}
                        onChange={(e) => setHero({
                          ...hero,
                          typewriter: { ...hero.typewriter, typeSpeed: parseInt(e.target.value) }
                        })}
                        min="20"
                        max="200"
                        className={`w-full px-3 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Back Speed (ms)
                      </label>
                      <input
                        type="number"
                        value={hero.typewriter.backSpeed || 30}
                        onChange={(e) => setHero({
                          ...hero,
                          typewriter: { ...hero.typewriter, backSpeed: parseInt(e.target.value) }
                        })}
                        min="10"
                        max="150"
                        className={`w-full px-3 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hero.typewriter.loop !== false}
                      onChange={(e) => setHero({
                        ...hero,
                        typewriter: { ...hero.typewriter, loop: e.target.checked }
                      })}
                      className="w-4 h-4 rounded"
                    />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      Loop Continuously
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>
        )}

        {/* Buttons Tab */}
        {activeTab === 'buttons' && (
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newButton.text}
                  onChange={(e) => setNewButton({ ...newButton, text: e.target.value })}
                  placeholder="Button text"
                  className={`flex-1 min-w-[120px] px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="text"
                  value={newButton.link}
                  onChange={(e) => setNewButton({ ...newButton, link: e.target.value })}
                  placeholder="Button link"
                  className={`flex-1 min-w-[150px] px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <select
                  value={newButton.variant}
                  onChange={(e) => setNewButton({ ...newButton, variant: e.target.value })}
                  className={`px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
                <button
                  type="button"
                  onClick={addButton}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                >
                  <FiPlus size={18} />
                  Add
                </button>
              </div>
              
              <div className="space-y-2">
                {hero.ctaButtons.map((button, index) => (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <input
                      type="text"
                      value={button.text}
                      onChange={(e) => updateButton(index, 'text', e.target.value)}
                      className={`flex-1 min-w-[100px] px-2 py-1 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    />
                    <input
                      type="text"
                      value={button.link}
                      onChange={(e) => updateButton(index, 'link', e.target.value)}
                      className={`flex-1 min-w-[150px] px-2 py-1 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    />
                    <select
                      value={button.variant}
                      onChange={(e) => updateButton(index, 'variant', e.target.value)}
                      className={`px-2 py-1 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-600 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeButton(index)}
                      className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Image Tab */}
        {activeTab === 'image' && (
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">Hero Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {hero.image.value && (
                <img src={hero.image.value} alt="Hero Preview" className="mt-2 max-h-48 rounded-lg" />
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center sm:justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2"
            disabled={saving}
          >
            <FiSave size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroManagement;