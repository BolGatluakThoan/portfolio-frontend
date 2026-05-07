import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

const FeaturedProjects = ({ projects }) => {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
      >
        Featured Projects
      </motion.h2>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className={`card group ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            {project.image?.value && project.image.value !== 'https://via.placeholder.com/500' && (
              <div className="relative overflow-hidden h-48">
                <img
                  src={project.image.value}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
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
                  {project.techStack.slice(0, 3).map((tech, i) => (
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
      </motion.div>
      
      {projects.length >= 3 && (
        <div className="text-center mt-8">
          <Link
            to="/projects"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105"
          >
            View All Projects
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedProjects;