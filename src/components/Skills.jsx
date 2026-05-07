import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Skills = ({ skills }) => {
  const { theme } = useTheme();

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const getLevelWidth = (level) => {
    const levels = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };
    return levels[level] || 0;
  };

  // Function to render icon (supports emoji, text, and image URLs)
  const renderIcon = (icon) => {
    if (!icon) return null;
    
    // Check if it's a URL (starts with http:// or https://)
    if (icon.startsWith('http://') || icon.startsWith('https://')) {
      return (
        <img 
          src={icon} 
          alt="skill icon" 
          className="w-6 h-6 object-contain rounded"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    // Check if it's an emoji (simple check for common emoji patterns)
    const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    if (emojiRegex.test(icon)) {
      return <span className="text-xl">{icon}</span>;
    }
    
    // Otherwise render as text
    return <span className="text-sm font-mono text-gray-500">{icon}</span>;
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
      >
        Technical Skills
      </motion.h2>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-8"
      >
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <motion.div
            key={category}
            variants={itemVariants}
            className="space-y-6"
          >
            <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
              {category}
            </h3>
            <div className="space-y-4">
              {categorySkills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {skill.icon && renderIcon(skill.icon)}
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {skill.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{skill.level}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getLevelWidth(skill.level)}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-primary-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Skills;