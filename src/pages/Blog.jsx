import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiCalendar, FiUser, FiTag, FiArrowRight } from 'react-icons/fi';
import api from '../services/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const { theme } = useTheme();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const [blogsRes, settingsRes] = await Promise.all([
          api.get('/blogs'),
          api.get('/settings'),
        ]);
        setBlogs(blogsRes.data.blogs || []);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{settings?.siteTitle || 'Portfolio'} | Blog</title>
        <meta name="description" content="Read my latest thoughts, tutorials, and insights on web development, technology, and programming." />
      </Helmet>
      
      <div className="py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Blog
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Thoughts, tutorials, and insights on web development, technology, and programming.
          </p>
        </motion.div>
        
        {blogs.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Image */}
                {blog.image?.value && (
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={blog.image.value}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs mb-3">
                    <span className="flex items-center gap-1 text-gray-500">
                      <FiCalendar size={12} />
                      {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <FiUser size={12} />
                      {blog.views || 0} views
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className={`text-xl font-bold mb-3 line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <Link to={`/blog/${blog.slug}`} className="hover:text-primary-600 transition-colors">
                      {blog.title}
                    </Link>
                  </h2>
                  
                  {/* Excerpt */}
                  <p className={`mb-4 line-clamp-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {blog.excerpt}
                  </p>
                  
                  {/* Tags */}
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        >
                          <FiTag size={10} />
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                          +{blog.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Read More Link */}
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm group/link"
                  >
                    Read More
                    <FiArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;