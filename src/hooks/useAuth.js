import { useEffect } from 'react';
import api from '../services/api';

export const useAuth = () => {
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Verify token is still valid
        await api.get('/auth/me');
        console.log('Token is valid');
      } catch (error) {
        console.log('Token invalid, logging out');
        localStorage.removeItem('token');
        if (window.location.pathname.includes('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    };

    // Check auth on mount
    checkAuth();

    // Optional: Check auth every 5 minutes to keep session alive
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
};