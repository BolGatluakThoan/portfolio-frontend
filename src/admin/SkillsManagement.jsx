import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiEdit2, FiTrash2, FiPlus, FiX, FiMove, FiUpload, 
  FiImage, FiTrash2 as FiTrashIcon, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import api from '../services/api';

const SkillsManagement = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 'Intermediate',
    icon: '',
    order: 0,
  });
  const { theme } = useTheme();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills');
      setSkills(data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    setUploading(true);
    setError('');
    
    try {
      const { data } = await api.post('/upload/skill', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({
        ...formData,
        icon: data.value
      });
      setSuccess('Icon uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload icon');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, formData);
        setSuccess('Skill updated successfully!');
      } else {
        await api.post('/skills', formData);
        setSuccess('Skill created successfully!');
      }
      fetchSkills();
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save skill:', error);
      setError('Failed to save skill');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/skills/${id}`);
        fetchSkills();
        setSuccess('Skill deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Failed to delete skill:', error);
        setError('Failed to delete skill');
      }
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || '',
      order: skill.order,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Frontend',
      level: 'Intermediate',
      icon: '',
      order: 0,
    });
    setError('');
  };

  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Skills Management
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition"
        >
          <FiPlus size={20} />
          Add Skill
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const categorySkills = skills.filter(s => s.category === category);
          if (categorySkills.length === 0) return null;
          
          return (
            <div key={category} className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
                {category}
              </h3>
              <div className="space-y-3">
                {categorySkills.map((skill, idx) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FiMove className="text-gray-400 cursor-move" size={16} />
                        {skill.icon && (
                          skill.icon.startsWith('http') ? (
                            <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain" />
                          ) : (
                            <span className="text-lg">{skill.icon}</span>
                          )
                        )}
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {skill.name}
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">{skill.level}</span>
                          <span className="text-gray-500">{skill.level}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-600 rounded-full"
                            style={{
                              width: skill.level === 'Beginner' ? '25%' :
                                     skill.level === 'Intermediate' ? '50%' :
                                     skill.level === 'Advanced' ? '75%' : '100%'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(skill)}
                        className={`p-2 rounded-lg transition ${
                          theme === 'dark'
                            ? 'hover:bg-gray-600 text-blue-400'
                            : 'hover:bg-gray-200 text-blue-600'
                        }`}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className={`p-2 rounded-lg transition ${
                          theme === 'dark'
                            ? 'hover:bg-gray-600 text-red-400'
                            : 'hover:bg-gray-200 text-red-600'
                        }`}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-lg max-w-md w-full ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Proficiency Level *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Icon
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className={`flex-1 px-3 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Emoji, icon name, or image URL"
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

                    <div className="mt-4">
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Upload Icon Image
                      </label>
                      <div className="flex items-center gap-4 flex-wrap">
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
                            onChange={handleIconUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                        {formData.icon && formData.icon.startsWith('http') && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: '' })}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                          >
                            <FiTrashIcon size={16} />
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-xs mt-2 text-gray-500">Supports JPG, PNG, GIF, WebP up to 5MB</p>
                    </div>

                    {formData.icon && formData.icon.startsWith('http') && (
                      <div className="mt-4">
                        <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Preview:
                        </p>
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 inline-block">
                          <img
                            src={formData.icon}
                            alt="Icon preview"
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/40x40/e2e8f0/475569?text=❌';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      {editingSkill ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsManagement;