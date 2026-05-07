import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FiArrowLeft, FiSun, FiMoon, FiHome } from "react-icons/fi";

const MinimalHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${theme === "dark" ? "bg-gray-900/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 group text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <FiArrowLeft
              className="transition-transform group-hover:-translate-x-1"
              size={18}
            />
            <span className="text-sm font-medium">Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FiHome size={16} />
              <span>Home</span>
            </Link>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader;
