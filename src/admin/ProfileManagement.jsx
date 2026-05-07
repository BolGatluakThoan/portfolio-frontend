import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FiUser, FiMail, FiShield, FiLock, FiEye, FiEyeOff, 
  FiSave, FiRefreshCw, FiCheckCircle, FiAlertCircle,
  FiKey, FiUpload, FiTrash2, FiImage
} from 'react-icons/fi';
import api from '../services/api';

const ProfileManagement = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    avatar: { type: 'url', value: '' },
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setProfile({
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'admin',
        avatar: data.avatar || { type: 'url', value: '' },
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setProfileError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');
    
    try {
      await api.put('/auth/update-profile', {
        name: profile.name,
        avatar: profile.avatar,
      });
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    setUploadingAvatar(true);
    try {
      const { data } = await api.post('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({
        ...profile,
        avatar: { type: 'upload', value: data.value }
      });
      setProfileSuccess('Avatar uploaded successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setProfileError('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = () => {
    setProfile({
      ...profile,
      avatar: { type: 'url', value: '' }
    });
    setProfileSuccess('Avatar removed');
    setTimeout(() => setProfileSuccess(''), 2000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordSuccess('');
    setPasswordError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setChangingPassword(false);
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setChangingPassword(false);
      return;
    }
    
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Profile Settings
        </h2>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage your account information, profile picture, and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center gap-2`}>
            <FiUser size={20} className="text-primary-600" />
            <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Profile Information
            </h3>
          </div>
          
          <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
            {profileSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2 text-sm"
              >
                <FiCheckCircle size={16} />
                {profileSuccess}
              </motion.div>
            )}
            
            {profileError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm">
                <FiAlertCircle size={16} />
                {profileError}
              </div>
            )}
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                {profile.avatar?.value ? (
                  <img
                    src={profile.avatar.value}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-600 shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/100x100/e2e8f0/475569?text=User';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                    <FiUser size={40} className="text-white" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-1 bg-primary-600 rounded-full cursor-pointer hover:bg-primary-700 transition">
                  <FiUpload size={14} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="text-xs text-red-500 hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-600 cursor-not-allowed ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-400'
                      : 'border-gray-300 text-gray-500'
                  }`}
                />
              </div>
              <p className="text-xs mt-1 text-gray-500">Email cannot be changed</p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Role
              </label>
              <div className="relative">
                <FiShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={profile.role === 'admin' ? 'Administrator' : profile.role === 'editor' ? 'Editor' : 'Viewer'}
                  disabled
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-600 cursor-not-allowed ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-400'
                      : 'border-gray-300 text-gray-500'
                  }`}
                />
              </div>
            </div>
            
            {/* Avatar URL Option */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Avatar URL (Optional)
              </label>
              <div className="relative">
                <FiImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="url"
                  value={profile.avatar?.type === 'url' ? profile.avatar.value : ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    avatar: { type: 'url', value: e.target.value }
                  })}
                  placeholder="https://example.com/avatar.jpg"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <p className="text-xs mt-1 text-gray-500">Enter a URL for your profile picture, or upload one above</p>
            </div>
            
            <button
              type="submit"
              disabled={savingProfile}
              className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {savingProfile ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  Update Profile
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center gap-2`}>
            <FiKey size={20} className="text-primary-600" />
            <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Change Password
            </h3>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            {passwordSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2 text-sm"
              >
                <FiCheckCircle size={16} />
                {passwordSuccess}
              </motion.div>
            )}
            
            {passwordError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm">
                <FiAlertCircle size={16} />
                {passwordError}
              </div>
            )}
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Current Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <p className="text-xs mt-1 text-gray-500">Minimum 6 characters</p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {changingPassword ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Changing Password...
                </>
              ) : (
                <>
                  <FiKey size={18} />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Security Tips */}
      <div className={`mt-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-blue-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-blue-100'}`}>
        <h4 className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          <FiShield size={16} />
          Security Tips
        </h4>
        <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <li>• Use a strong, unique password</li>
          <li>• Never share your password with anyone</li>
          <li>• Change your password regularly</li>
          <li>• Contact support if you notice any suspicious activity</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileManagement;