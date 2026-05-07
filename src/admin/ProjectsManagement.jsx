import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiEdit2, FiTrash2, FiPlus, FiX, FiStar, FiUpload, 
  FiImage, FiTrash2 as FiTrashIcon, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import api from '../services/api';

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [],
    techStackInput: '',
    image: { type: 'url', value: '' },
    links: { live: '', github: '' },
    featured: false,
    order: 0,
  });
  const { theme } = useTheme();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    
    setUploading(true);
    setError('');
    
    try {
      const { data } = await api.post('/upload/project', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({
        ...formData,
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
    setFormData({
      ...formData,
      image: { type: 'url', value: '' }
    });
    setSuccess('Image removed');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const projectData = {
        ...formData,
        techStack: formData.techStack.filter(t => t.trim()),
      };
      
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, projectData);
        setSuccess('Project updated successfully!');
      } else {
        await api.post('/projects', projectData);
        setSuccess('Project created successfully!');
      }
      fetchProjects();
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save project:', error);
      setError('Failed to save project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
        setSuccess('Project deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Failed to delete project:', error);
        setError('Failed to delete project');
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack || [],
      techStackInput: '',
      image: project.image || { type: 'url', value: '' },
      links: project.links || { live: '', github: '' },
      featured: project.featured || false,
      order: project.order || 0,
    });
    setShowModal(true);
  };

  const handleToggleFeatured = async (project) => {
    try {
      await api.put(`/projects/${project._id}`, { ...project, featured: !project.featured });
      fetchProjects();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  const addTechStack = () => {
    if (formData.techStackInput.trim()) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, formData.techStackInput.trim()],
        techStackInput: '',
      });
    }
  };

  const removeTechStack = (index) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((_, i) => i !== index),
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      techStack: [],
      techStackInput: '',
      image: { type: 'url', value: '' },
      links: { live: '', github: '' },
      featured: false,
      order: 0,
    });
    setError('');
  };

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
          Projects Management
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition"
        >
          <FiPlus size={20} />
          Add Project
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-lg shadow-lg overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {project.image?.value && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image.value}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x300/e2e8f0/475569?text=No+Image';
                    }}
                  />
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
                    title={project.featured ? "Remove from featured" : "Mark as featured"}
                  >
                    <FiStar 
                      className={project.featured ? "text-yellow-400 fill-current" : "text-white"} 
                      size={18} 
                    />
                  </button>
                </div>
              )}
              <div className="p-4">
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {project.title}
                </h3>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.description?.substring(0, 100)}...
                </p>
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className={`p-2 rounded-lg transition ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700 text-blue-400'
                          : 'hover:bg-gray-100 text-blue-600'
                      }`}
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className={`p-2 rounded-lg transition ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700 text-red-400'
                          : 'hover:bg-gray-100 text-red-600'
                      }`}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                  {project.featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
              className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {editingProject ? 'Edit Project' : 'Add New Project'}
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
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="4"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  
                  {/* Image Upload Section */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FiImage className="inline mr-2" size={16} />
                      Project Image
                    </label>
                    
                    {/* URL Input */}
                    <input
                      type="url"
                      value={formData.image.value}
                      onChange={(e) => setFormData({
                        ...formData,
                        image: { type: 'url', value: e.target.value }
                      })}
                      className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="https://example.com/project-image.jpg"
                    />
                    
                    <div className="relative my-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                          OR
                        </span>
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <label className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        <FiUpload size={18} />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      {formData.image.value && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                        >
                          <FiTrashIcon size={16} />
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs mt-2 text-gray-500">Supports JPG, PNG, GIF, WebP up to 5MB</p>

                    {/* Image Preview */}
                    {formData.image.value && (
                      <div className="mt-4">
                        <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Preview:
                        </p>
                        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-2 inline-block">
                          <img
                            src={formData.image.value}
                            alt="Preview"
                            className="max-w-full max-h-32 object-contain"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/400x300/e2e8f0/475569?text=Invalid+Image';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tech Stack
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={formData.techStackInput}
                        onChange={(e) => setFormData({ ...formData, techStackInput: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                        className={`flex-1 px-3 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="React, Node.js, etc."
                      />
                      <button
                        type="button"
                        onClick={addTechStack}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechStack(idx)}
                            className="hover:text-red-500"
                          >
                            <FiX size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Live URL
                    </label>
                    <input
                      type="url"
                      value={formData.links.live}
                      onChange={(e) => setFormData({
                        ...formData,
                        links: { ...formData.links, live: e.target.value }
                      })}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.links.github}
                      onChange={(e) => setFormData({
                        ...formData,
                        links: { ...formData.links, github: e.target.value }
                      })}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded"
                      />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        Featured Project
                      </span>
                    </label>
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
                      {editingProject ? 'Update' : 'Create'}
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

export default ProjectsManagement;