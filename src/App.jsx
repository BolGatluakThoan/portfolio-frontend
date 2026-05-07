import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import NotFound from './pages/NotFound';
import AnalyticsLoader from './components/AnalyticsLoader';
import Unsubscribe from './pages/Unsubscribe';


function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          {/* AnalyticsLoader will load Google Analytics if configured */}
          <AnalyticsLoader />
          
          <Routes>
            {/* Public routes with main layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="projects" element={<Projects />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="contact" element={<Contact />} />
            </Route>
            
            {/* Unsubscribe route */}
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            
            {/* Hidden admin login */}
            <Route path="/admin/login" element={<PublicLayout />}>
              <Route index element={<AdminLogin />} />
            </Route>
            
            {/* Protected admin routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;