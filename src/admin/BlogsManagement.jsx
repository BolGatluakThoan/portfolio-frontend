import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiEdit2, FiTrash2, FiPlus, FiX, FiEye, FiEyeOff, 
  FiUpload, FiImage, FiTag, FiCalendar, FiUser, FiSave,
  FiRefreshCw, FiLink
} from 'react-icons/fi';
import api from '../services/api';

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [activeTab, setActiveTab] = useState('write');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: { type: 'url', value: '' },
    tags: [],
    tagInput: '',
    published: false,
  });
  const { theme } = useTheme();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs/all');
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
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
    try {
      const { data } = await api.post('/upload/single', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({
        ...formData,
        image: { type: 'upload', value: data.value }
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        tags: formData.tags || [],
        published: formData.published,
        publishedAt: formData.published ? new Date() : null,
      };
      
      if (editingBlog) {
        await api.put(`/blogs/${editingBlog._id}`, blogData);
      } else {
        await api.post('/blogs', blogData);
      }
      fetchBlogs();
      closeModal();
    } catch (error) {
      console.error('Failed to save blog:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchBlogs();
      } catch (error) {
        console.error('Failed to delete blog:', error);
      }
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      image: blog.image || { type: 'url', value: '' },
      tags: blog.tags || [],
      tagInput: '',
      published: blog.published || false,
    });
    setShowModal(true);
  };

  const handleTogglePublish = async (blog) => {
    try {
      await api.put(`/blogs/${blog._id}`, { 
        ...blog, 
        published: !blog.published,
        publishedAt: !blog.published ? new Date() : null,
      });
      fetchBlogs();
    } catch (error) {
      console.error('Failed to toggle publish:', error);
    }
  };

  const addTag = () => {
    if (formData.tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), formData.tagInput.trim()],
        tagInput: '',
      });
    }
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((_, i) => i !== index),
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: { type: 'url', value: '' },
      tags: [],
      tagInput: '',
      published: false,
    });
    setActiveTab('write');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Blogs Management
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105"
        >
          <FiPlus size={20} />
          Write New Blog
        </button>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className={`group rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Image Section */}
              {blog.image?.value && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.image.value}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/800x400/e2e8f0/475569?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      className={`p-2 rounded-lg backdrop-blur-sm transition-all ${
                        blog.published
                          ? 'bg-green-500/80 text-white hover:bg-green-600'
                          : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600'
                      }`}
                      title={blog.published ? 'Published' : 'Draft'}
                    >
                      {blog.published ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs mb-3">
                  <span className="flex items-center gap-1 text-gray-500">
                    <FiCalendar size={12} />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  {blog.views > 0 && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <FiUser size={12} />
                      {blog.views} views
                    </span>
                  )}
                </div>
                
                <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {blog.title}
                </h3>
                <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {blog.excerpt}
                </p>
                
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <FiTag size={10} />
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleEdit(blog)}
                    className={`p-2 rounded-lg transition ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-blue-400'
                        : 'hover:bg-gray-100 text-blue-600'
                    }`}
                    title="Edit"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className={`p-2 rounded-lg transition ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-red-400'
                        : 'hover:bg-gray-100 text-red-600'
                    }`}
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal for Create/Edit Blog */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-inherit px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {editingBlog ? 'Edit Blog Post' : 'Write New Blog Post'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="p-6">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'write'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Write
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
                    onClick={() => setActiveTab('tags')}
                    className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                      activeTab === 'tags'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiTag size={16} />
                    Tags
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Write Tab */}
                  {activeTab === 'write' && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          }`}
                          placeholder="What's the title of your blog post?"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Excerpt *
                        </label>
                        <textarea
                          value={formData.excerpt || ''}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          rows="3"
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          }`}
                          placeholder="A short summary of your blog post..."
                          required
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Content * (HTML Supported)
                        </label>
                        <textarea
                          value={formData.content || ''}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          rows="12"
                          className={`w-full px-4 py-3 rounded-xl border font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          }`}
                          placeholder="Write your blog content here. Use HTML tags for formatting: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;code&gt;, etc."
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Tab */}
                  {activeTab === 'image' && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <FiLink className="inline mr-1" size={14} />
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.image?.value || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            image: { type: 'url', value: e.target.value }
                          })}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          }`}
                          placeholder="https://example.com/featured-image.jpg"
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
                          <FiUpload className="inline mr-1" size={14} />
                          Upload Image
                        </label>
                        <div className="flex items-center gap-4">
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
                          {uploading && (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                          )}
                        </div>
                        <p className="text-xs mt-2 text-gray-500">Supports JPG, PNG, GIF, WebP up to 5MB</p>
                      </div>

                      {formData.image?.value && (
                        <div className="mt-4">
                          <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Preview:
                          </p>
                          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                              src={formData.image.value}
                              alt="Preview"
                              className="w-full max-h-64 object-cover"
                              onError={(e) => {
                                e.target.src = 'https://placehold.co/800x400/e2e8f0/475569?text=Invalid+Image+URL';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags Tab */}
                  {activeTab === 'tags' && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          <FiTag className="inline mr-1" size={14} />
                          Add Tags
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.tagInput || ''}
                            onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            className={`flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            }`}
                            placeholder="React, JavaScript, Tutorial, etc."
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition flex items-center gap-2"
                          >
                            <FiPlus size={18} />
                            Add
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 min-h-[100px]">
                        {(formData.tags || []).length === 0 ? (
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            No tags added yet. Add tags to help readers find your content.
                          </p>
                        ) : (
                          (formData.tags || []).map((tag, idx) => (
                            <span
                              key={idx}
                              className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                            >
                              <FiTag size={12} />
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(idx)}
                                className="hover:text-red-500 transition-colors"
                              >
                                <FiX size={14} />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Publish Options */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published || false}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Publish immediately
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-5 py-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg transition flex items-center gap-2"
                    >
                      <FiSave size={18} />
                      {editingBlog ? 'Update Blog' : 'Publish Blog'}
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

export default BlogsManagement;