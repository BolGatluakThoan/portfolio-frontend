import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiMail, FiEdit2, FiSave, FiRefreshCw, FiEye, FiX, 
  FiCheckCircle, FiAlertCircle, FiCopy
} from 'react-icons/fi';
import api from '../services/api';

const EmailTemplatesManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setError('');
      const { data } = await api.get('/email-templates');
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load templates');
      if (error.response?.status === 401) {
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      await api.put(`/email-templates/${editingTemplate._id}`, {
        subject: editingTemplate.subject,
        html: editingTemplate.html,
        displayName: editingTemplate.displayName,
        isActive: editingTemplate.isActive,
      });
      setSuccess('Template updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchTemplates();
      setEditingTemplate(null);
    } catch (error) {
      setError('Failed to update template');
      console.error('Update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (templateName) => {
    if (window.confirm('Reset this template to default? This cannot be undone.')) {
      try {
        await api.post(`/email-templates/${templateName}/reset`);
        fetchTemplates();
        setSuccess('Template reset to default!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to reset template');
        console.error('Reset error:', error);
      }
    }
  };

  const handlePreview = async (template) => {
    setShowPreview(true);
    setPreviewHtml('Loading preview...');
    try {
      const { data } = await api.post('/email-templates/preview', {
        html: template.html,
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message to preview the email template.',
        }
      });
      setPreviewHtml(data.html);
    } catch (error) {
      console.error('Preview error:', error);
      setPreviewHtml('Failed to load preview');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Email Templates
        </h2>
        <button
          onClick={fetchTemplates}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition"
        >
          <FiRefreshCw size={18} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
          <FiAlertCircle size={18} />
          {error}
        </div>
      )}

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

      {templates.length === 0 && !error ? (
        <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          No email templates found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div
              key={template._id}
              className={`rounded-xl overflow-hidden shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                <div>
                  <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {template.displayName}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {template.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(template)}
                    className={`p-2 rounded-lg transition ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                        : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                    }`}
                    title="Preview"
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className={`p-2 rounded-lg transition ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                        : 'bg-gray-100 text-yellow-600 hover:bg-gray-200'
                    }`}
                    title="Edit"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleReset(template.name)}
                    className={`p-2 rounded-lg transition ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-orange-400 hover:bg-gray-600'
                        : 'bg-gray-100 text-orange-600 hover:bg-gray-200'
                    }`}
                    title="Reset to Default"
                  >
                    <FiRefreshCw size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Subject:
                  </span>
                  <p className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {template.subject}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    template.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingTemplate(null)}>
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-inherit p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Edit {editingTemplate.displayName}
              </h3>
              <button onClick={() => setEditingTemplate(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={editingTemplate.displayName}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, displayName: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject (supports variables)
                </label>
                <input
                  type="text"
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <p className="text-xs mt-1 text-gray-500">Available: &#123;&#123;name&#125;&#125;, &#123;&#123;subject&#125;&#125;, &#123;&#123;message&#125;&#125;, &#123;&#123;siteName&#125;&#125;, &#123;&#123;year&#125;&#125;</p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  HTML Content
                </label>
                <textarea
                  value={editingTemplate.html}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, html: e.target.value })}
                  rows="15"
                  className={`w-full px-3 py-2 rounded-lg border font-mono text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingTemplate.isActive}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                >
                  {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <FiSave size={18} />}
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-inherit p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Email Preview
              </h3>
              <button onClick={() => setShowPreview(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <div className="p-4">
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplatesManagement;