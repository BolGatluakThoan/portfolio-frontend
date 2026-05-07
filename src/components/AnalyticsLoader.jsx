import React, { useEffect } from 'react';
import api from '../services/api';

const AnalyticsLoader = () => {
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const { data } = await api.get('/settings');
        const gaId = data.googleAnalyticsId;
        
        if (gaId && gaId.startsWith('G-')) {
          // Remove existing Google Analytics script if any
          const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag"]');
          if (existingScript) {
            existingScript.remove();
          }
          
          // Load Google Analytics
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          document.head.appendChild(script);
          
          // Initialize gtag
          window.dataLayer = window.dataLayer || [];
          window.gtag = function() { 
            window.dataLayer.push(arguments); 
          };
          window.gtag('js', new Date());
          window.gtag('config', gaId);
          
          console.log('✅ Google Analytics loaded with ID:', gaId);
        }
      } catch (error) {
        console.error('❌ Failed to load analytics:', error);
      }
    };
    
    loadAnalytics();
  }, []);
  
  // Return null, not a function
  return null;
};

export default AnalyticsLoader;