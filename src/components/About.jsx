import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const About = ({ data }) => {
  const { theme } = useTheme();

  if (!data) return null;

  return (
    <section className="py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {data.image?.value && data.image.value !== 'https://via.placeholder.com/400' && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <img
              src={data.image.value}
              alt="About"
              className="rounded-2xl shadow-xl w-full"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`order-1 lg:order-2 space-y-6 ${(!data.image?.value || data.image.value === 'https://via.placeholder.com/400') && 'lg:col-span-2'}`}
        >
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            About Me
          </h2>
          <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} max-w-none`}>
            <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {data.bio}
            </p>
          </div>
          
          {data.skillsSummary && (
            <div className="mt-6">
              <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Skills Summary
              </h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {data.skillsSummary}
              </p>
            </div>
          )}
          
          {(data.experiences?.length > 0 || data.education?.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {data.experiences?.length > 0 && (
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Experience
                  </h3>
                  <div className="space-y-4">
                    {data.experiences.map((exp, idx) => (
                      <div key={idx}>
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {exp.title}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {exp.company} | {exp.period}
                        </p>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {data.education?.length > 0 && (
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Education
                  </h3>
                  <div className="space-y-4">
                    {data.education.map((edu, idx) => (
                      <div key={idx}>
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {edu.degree}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {edu.institution} | {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default About;