import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Typed from 'typed.js';

const Hero = ({ data }) => {
  const { theme } = useTheme();
  const typedElement = useRef(null);
  const typedInstance = useRef(null);

  useEffect(() => {
    if (data?.typewriter?.enabled && typedElement.current) {
      typedInstance.current = new Typed(typedElement.current, {
        strings: data.typewriter.strings || ['Software Engineer', 'Full Stack Developer', 'Problem Solver'],
        typeSpeed: data.typewriter.typeSpeed || 50,
        backSpeed: data.typewriter.backSpeed || 30,
        loop: data.typewriter.loop !== false,
        backDelay: 1500,
        startDelay: 500,
        showCursor: true,
        cursorChar: '|',
      });
    }

    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data) return null;

  return (
    <section className="py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className={`text-4xl lg:text-6xl font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {data.title}
            <span className="block mt-2">
              {data.typewriter?.enabled ? (
                <span 
                  ref={typedElement}
                  className="text-primary-600 dark:text-primary-400"
                />
              ) : (
                <span className="text-primary-600 dark:text-primary-400">{data.subtitle}</span>
              )}
            </span>
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {data.description}
          </p>
          <div className="flex flex-wrap gap-4">
            {data.ctaButtons?.map((btn, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={btn.link}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 inline-block ${
                    btn.variant === 'primary'
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                      : `border-2 ${
                          theme === 'dark'
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`
                  }`}
                >
                  {btn.text}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {data.image?.value && data.image.value !== '' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src={data.image.value}
              alt={data.title}
              className="rounded-2xl shadow-2xl max-w-full h-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Hero;