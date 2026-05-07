import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiPlus, FiEdit2, FiTrash2, FiX, FiUser, FiMail, 
  FiLock, FiShield, FiCheckCircle, FiAlertCircle, FiRefreshCw,
  FiKey, FiUsers, FiUserCheck, FiUserX, FiImage, FiUpload, FiTrash2 as FiTrashIcon
} from 'react-icons/fi';
import api from '../services/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [resettingPassword, setResettingPassword] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor',
    avatar: { type: 'url', value: '' },
  });
  const [passwordReset, setPasswordReset] = useState({ newPassword: '' });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    
    setUploading(true);
    setError('');
    
    try {
      const { data } = await api.post('/upload/profile', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({
        ...formData,
        avatar: { type: 'upload', value: data.value }
      });
      setSuccess('Avatar uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = () => {
    setFormData({
      ...formData,
      avatar: { type: 'url', value: '' }
    });
    setSuccess('Avatar removed');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingUser) {
        await api.put(`/auth/users/${editingUser._id}`, {
          name: formData.name,
          role: formData.role,
          isActive: formData.isActive,
          avatar: formData.avatar,
        });
        setSuccess('User updated successfully!');
      } else {
        await api.post('/auth/users', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          avatar: formData.avatar,
        });
        setSuccess('User created successfully!');
      }
      fetchUsers();
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwordReset.newPassword || passwordReset.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await api.post(`/auth/users/${resettingPassword._id}/reset-password`, {
        newPassword: passwordReset.newPassword,
      });
      setSuccess(`Password reset for ${resettingPassword.name}`);
      setResettingPassword(null);
      setPasswordReset({ newPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      try {
        await api.delete(`/auth/users/${user._id}`);
        fetchUsers();
        setSuccess(`${user.name} deleted successfully`);
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      avatar: user.avatar || { type: 'url', value: '' },
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/auth/users/${user._id}`, {
        isActive: !user.isActive,
      });
      fetchUsers();
      setSuccess(`${user.name} ${!user.isActive ? 'activated' : 'deactivated'}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update status');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'editor',
      avatar: { type: 'url', value: '' },
    });
    setError('');
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
    };
    const labels = {
      admin: 'Administrator',
      editor: 'Editor',
      viewer: 'Viewer',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role] || styles.viewer}`}>
        {labels[role] || role}
      </span>
    );
  };

  // Function to render user avatar
  const renderUserAvatar = (user) => {
    const avatarUrl = user.avatar?.value;
    
    if (avatarUrl && avatarUrl.startsWith('http')) {
      return (
        <img
          src={avatarUrl}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              `;
            }
          }}
        />
      );
    }
    
    return (
      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
        <FiUser size={14} className="text-primary-600 dark:text-primary-400" />
      </div>
    );
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
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            User Management
          </h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage administrators, editors, and viewers
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <FiPlus size={20} />
          Add New User
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

      {/* Users Table */}
      <div className={`rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Last Login</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
               </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {renderUserAvatar(user)}
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {user.name}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      user.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user.isActive ? <FiUserCheck size={10} /> : <FiUserX size={10} />}
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2 rounded-lg transition ${
                          user.isActive
                            ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20'
                            : 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20'
                        }`}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                      </button>
                      <button
                        onClick={() => setResettingPassword(user)}
                        className="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition"
                        title="Reset Password"
                      >
                        <FiKey size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal - SCROLLABLE */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-inherit p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button onClick={closeModal} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name *
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
                
                {!editingUser && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        Password *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        required
                        minLength="6"
                      />
                      <p className="text-xs mt-1 text-gray-500">Minimum 6 characters</p>
                    </div>
                  </>
                )}
                
                {/* Avatar Section */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FiImage className="inline mr-2" size={14} />
                    Profile Picture
                  </label>
                  
                  <input
                    type="url"
                    value={formData.avatar.value}
                    onChange={(e) => setFormData({
                      ...formData,
                      avatar: { type: 'url', value: e.target.value }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="https://example.com/avatar.jpg"
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

                  <div className="flex items-center gap-4 flex-wrap">
                    <label className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <FiUpload size={18} />
                      {uploading ? 'Uploading...' : 'Upload Avatar'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {formData.avatar.value && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                      >
                        <FiTrashIcon size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs mt-2 text-gray-500">Supports JPG, PNG, GIF, WebP up to 5MB</p>

                  {formData.avatar.value && (
                    <div className="mt-4">
                      <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Preview:
                      </p>
                      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-2 inline-block">
                        <img
                          src={formData.avatar.value}
                          alt="Avatar preview"
                          className="w-16 h-16 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/100x100/e2e8f0/475569?text=❌';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="admin">Administrator (Full Access)</option>
                    <option value="editor">Editor (Content Management)</option>
                    <option value="viewer">Viewer (Read Only)</option>
                  </select>
                </div>
                
                {editingUser && (
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Account Active
                      </span>
                    </label>
                  </div>
                )}
                
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
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resettingPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setResettingPassword(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-inherit p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Reset Password
                </h3>
                <button onClick={() => setResettingPassword(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleResetPassword} className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    New Password for {resettingPassword.name}
                  </label>
                  <input
                    type="password"
                    value={passwordReset.newPassword}
                    onChange={(e) => setPasswordReset({ newPassword: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                    minLength="6"
                  />
                  <p className="text-xs mt-1 text-gray-500">Minimum 6 characters</p>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setResettingPassword(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersManagement;