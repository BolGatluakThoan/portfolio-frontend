import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiSave, FiRefreshCw, FiFileText, FiExternalLink, 
  FiUpload, FiTrash2, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import api from '../services/api';

const ResumeManagement = () => {
  const [resume, setResume] = useState({
    fileUrl: '',
    fileName: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await api.get('/resume');
      setResume(data);
    } catch (error) {
      console.error('Failed to fetch resume:', error);
      setError('Failed to load resume');
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
      await api.put('/resume', resume);
      setSuccess('Resume updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save resume:', error);
      setError('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and DOC/DOCX files are allowed');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    
    setUploading(true);
    setError('');
    
    try {
      const { data } = await api.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResume({
        fileUrl: data.value,
        fileName: file.name,
      });
      setSuccess('Resume uploaded successfully! Click "Save Resume" to confirm.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const removeResume = () => {
    setResume({
      fileUrl: '',
      fileName: '',
    });
    setSuccess('Resume removed');
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Resume Management
        </h2>
        <button
          onClick={fetchResume}
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
            Upload Resume
          </h3>
          
          <div className="space-y-4">
            {/* File Upload Section */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiUpload className="inline mr-2" size={16} />
                Upload Resume File
              </label>
              <div className="flex items-center gap-4 flex-wrap">
                <label className={`cursor-pointer px-5 py-3 rounded-xl flex items-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  <FiUpload size={18} />
                  {uploading ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {resume.fileName && (
                  <button
                    type="button"
                    onClick={removeResume}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                  >
                    <FiTrash2 size={18} />
                    Remove
                  </button>
                )}
              </div>
              <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Supports PDF, DOC, DOCX files up to 5MB
              </p>
            </div>

            {/* Divider */}
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

            {/* URL Input Section */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiFileText className="inline mr-2" size={16} />
                Resume File URL
              </label>
              <input
                type="url"
                value={resume.fileUrl}
                onChange={(e) => setResume({ ...resume, fileUrl: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="https://example.com/resume.pdf"
              />
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Upload your resume to a cloud service (Google Drive, Dropbox, etc.) and paste the public link here
              </p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                File Name
              </label>
              <input
                type="text"
                value={resume.fileName}
                onChange={(e) => setResume({ ...resume, fileName: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="resume.pdf"
              />
            </div>
            
            {resume.fileUrl && resume.fileUrl !== '#' && (
              <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Resume:
                </p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <FiFileText className="text-primary-600" size={20} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {resume.fileName || 'Resume File'}
                    </span>
                  </div>
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
                  >
                    <FiExternalLink size={16} />
                    Preview
                  </a>
                </div>
              </div>
            )}
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
                Save Resume
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeManagement;