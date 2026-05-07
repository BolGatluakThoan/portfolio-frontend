import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import api from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [projectsRes, settingsRes] = await Promise.all([
          api.get('/projects'),
          api.get('/settings'),
        ]);
        setProjects(projectsRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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
        <title>{settings?.siteTitle || 'Portfolio'} | Projects</title>
      </Helmet>
      
      <div className="py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl font-bold text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          My Projects
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-center mb-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Here are some of my recent work
        </motion.p>
        
        {projects.length === 0 ? (
          <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            No projects found.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={`card group ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                {project.image?.value && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.image.value}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x300/e2e8f0/475569?text=No+Image';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {project.title}
                  </h3>
                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {project.description}
                  </p>
                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-all hover:scale-110 ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-primary-600 hover:text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-primary-600 hover:text-white'
                        }`}
                      >
                        <FiGithub size={18} />
                      </a>
                    )}
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-all hover:scale-110 ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-primary-600 hover:text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-primary-600 hover:text-white'
                        }`}
                      >
                        <FiExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;