import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiPlus, FiX, FiSave, FiRefreshCw, FiBriefcase, FiBook, 
  FiUpload, FiImage, FiTrash2, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import api from '../services/api';

const AboutManagement = () => {
  const [about, setAbout] = useState({
    bio: '',
    skillsSummary: '',
    image: { type: 'url', value: '' },
    experiences: [],
    education: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    period: '',
    description: '',
  });
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    year: '',
  });
  const { theme } = useTheme();

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const { data } = await api.get('/about');
      setAbout(data);
    } catch (error) {
      console.error('Failed to fetch about:', error);
      setError('Failed to load about section');
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
      await api.put('/about', about);
      setSuccess('About section updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save about:', error);
      setError('Failed to save about section');
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
    setError('');
    
    try {
      const { data } = await api.post('/upload/about', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAbout({
        ...about,
        image: { type: 'upload', value: data.value }
      });
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setAbout({
      ...about,
      image: { type: 'url', value: '' }
    });
    setSuccess('Image removed');
    setTimeout(() => setSuccess(''), 2000);
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      setAbout({
        ...about,
        experiences: [...about.experiences, { ...newExperience }],
      });
      setNewExperience({ title: '', company: '', period: '', description: '' });
    }
  };

  const removeExperience = (index) => {
    setAbout({
      ...about,
      experiences: about.experiences.filter((_, i) => i !== index),
    });
  };

  const updateExperience = (index, field, value) => {
    const updatedExperiences = [...about.experiences];
    updatedExperiences[index][field] = value;
    setAbout({ ...about, experiences: updatedExperiences });
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setAbout({
        ...about,
        education: [...about.education, { ...newEducation }],
      });
      setNewEducation({ degree: '', institution: '', year: '' });
    }
  };

  const removeEducation = (index) => {
    setAbout({
      ...about,
      education: about.education.filter((_, i) => i !== index),
    });
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...about.education];
    updatedEducation[index][field] = value;
    setAbout({ ...about, education: updatedEducation });
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
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          About Section
        </h2>
        <button
          onClick={fetchAbout}
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
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
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
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'image'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiImage size={16} />
            Image
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'experience'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiBriefcase size={16} />
            Experience
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'education'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiBook size={16} />
            Education
          </button>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Bio *
                </label>
                <textarea
                  value={about.bio}
                  onChange={(e) => setAbout({ ...about, bio: e.target.value })}
                  rows="6"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Skills Summary
                </label>
                <textarea
                  value={about.skillsSummary}
                  onChange={(e) => setAbout({ ...about, skillsSummary: e.target.value })}
                  rows="3"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="React, Node.js, MongoDB, etc."
                />
              </div>
            </div>
          </div>
        )}

        {/* Image Tab */}
        {activeTab === 'image' && (
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Image URL
                </label>
                <input
                  type="url"
                  value={about.image.value}
                  onChange={(e) => setAbout({ ...about, image: { type: 'url', value: e.target.value } })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                    OR
                  </span>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upload Image
                </label>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className={`cursor-pointer px-5 py-3 rounded-xl flex items-center gap-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    <FiUpload size={18} />
                    {uploading ? 'Uploading...' : 'Choose Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {about.image.value && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                    >
                      <FiTrash2 size={18} />
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs mt-2 text-gray-500">Supports JPG, PNG, GIF, WebP up to 5MB</p>
              </div>

              {about.image.value && (
                <div className="mt-4">
                  <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Preview:
                  </p>
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-2 inline-block">
                    <img
                      src={about.image.value}
                      alt="Preview"
                      className="max-w-full max-h-48 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x400/e2e8f0/475569?text=Invalid+Image';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                  placeholder="Job title"
                  className={`flex-1 min-w-[120px] sm:min-w-[140px] px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="text"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  placeholder="Company"
                  className={`flex-1 min-w-[120px] sm:min-w-[140px] px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="text"
                  value={newExperience.period}
                  onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                  placeholder="Period"
                  className={`flex-1 min-w-[120px] sm:min-w-[140px] px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                >
                  <FiPlus size={18} />
                  Add
                </button>
              </div>
              
              <div>
                <textarea
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  placeholder="Job description"
                  rows="2"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {about.experiences.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          className={`flex-1 min-w-[120px] sm:min-w-[140px] px-2 py-1 rounded ${
                            theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                          }`}
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          className={`flex-1 min-w-[120px] sm:min-w-[140px] px-2 py-1 rounded ${
                            theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                          }`}
                          placeholder="Company"
                        />
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => updateExperience(index, 'period', e.target.value)}
                          className={`flex-1 min-w-[120px] sm:min-w-[140px] px-2 py-1 rounded ${
                            theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                          }`}
                          placeholder="Period"
                        />
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        className={`w-full px-2 py-1 rounded ${
                          theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                        }`}
                        rows="2"
                        placeholder="Description"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  placeholder="Degree"
                  className={`flex-1 min-w-[120px] sm:min-w-[140px] px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="text"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                  placeholder="Institution"
                  className={`flex-1 min-w-[120px] sm:min-w-[140px] px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="text"
                  value={newEducation.year}
                  onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                  placeholder="Year"
                  className={`flex-1 min-w-[120px] sm:min-w-[140px] px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                >
                  <FiPlus size={18} />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {about.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <div className="flex gap-2 flex-wrap mb-2">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          className={`flex-1 min-w-[120px] sm:min-w-[140px] px-2 py-1 rounded ${
                            theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                          }`}
                          placeholder="Degree"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          className={`flex-1 min-w-[120px] sm:min-w-[140px] px-2 py-1 rounded ${
                            theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                          }`}
                          placeholder="Institution"
                        />
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => updateEducation(index, 'year', e.target.value)}
                          className={`flex-1 min-w-[120px] sm:min-w-[140px] px-2 py-1 rounded ${
                            theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'
                          }`}
                          placeholder="Year"
                        />
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
          >
            <FiSave size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutManagement;