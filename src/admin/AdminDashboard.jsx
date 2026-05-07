import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminHome from './AdminHome';
import ProjectsManagement from './ProjectsManagement';
import BlogsManagement from './BlogsManagement';
import SkillsManagement from './SkillsManagement';
import MessagesView from './MessagesView';
import SettingsManagement from './SettingsManagement';
import NavbarManagement from './NavbarManagement';
import HeroManagement from './HeroManagement';
import AboutManagement from './AboutManagement';
import ContactManagement from './ContactManagement';
import ResumeManagement from './ResumeManagement';
import NewsletterManagement from './NewsletterManagement';
import EmailTemplatesManagement from './EmailTemplatesManagement';
import UsersManagement from './UsersManagement';
import ProfileManagement from './ProfileManagement';  // Add this import
import VisitorStats from './VisitorStats';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="projects" element={<ProjectsManagement />} />
        <Route path="blogs" element={<BlogsManagement />} />
        <Route path="skills" element={<SkillsManagement />} />
        <Route path="messages" element={<MessagesView />} />
        <Route path="newsletter" element={<NewsletterManagement />} />
        <Route path="email-templates" element={<EmailTemplatesManagement />} />
        <Route path="settings" element={<SettingsManagement />} />
        <Route path="navbar" element={<NavbarManagement />} />
        <Route path="hero" element={<HeroManagement />} />
        <Route path="about" element={<AboutManagement />} />
        <Route path="contact" element={<ContactManagement />} />
        <Route path="resume" element={<ResumeManagement />} />
        <Route path="profile" element={<ProfileManagement />} />  {/* Add this route */}
        <Route path="users" element={<UsersManagement />} />
        <Route path="visitors" element={<VisitorStats />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;