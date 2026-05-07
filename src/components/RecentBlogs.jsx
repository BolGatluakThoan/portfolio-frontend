import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { FiCalendar, FiUser, FiArrowRight, FiTag } from "react-icons/fi";

const RecentBlogs = ({ blogs }) => {
  const { theme } = useTheme();

  if (!blogs || blogs.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Recent Blog Posts
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-center max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Thoughts, tutorials, and insights from my development journey
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {blogs.map((blog, idx) => (
          <motion.article
            key={blog._id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Image */}
            {blog.image?.value && (
              <div className="relative overflow-hidden h-48">
                <img
                  src={blog.image.value}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/800x400/e2e8f0/475569?text=Blog+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            <div className="p-6">
              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs mb-3">
                <span
                  className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  <FiCalendar size={12} />
                  {new Date(
                    blog.publishedAt || blog.createdAt,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span
                  className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  <FiUser size={12} />
                  {blog.views || 0} views
                </span>
              </div>

              {/* Title */}
              <h3
                className={`text-xl font-bold mb-2 line-clamp-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                <Link
                  to={`/blog/${blog.slug}`}
                  className="hover:text-primary-600 transition-colors"
                >
                  {blog.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p
                className={`mb-4 line-clamp-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {blog.excerpt}
              </p>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        theme === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <FiTag size={10} />
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 2 && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}
                    >
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
                <FiArrowRight
                  size={14}
                  className="transition-transform group-hover/link:translate-x-1"
                />
              </Link>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* View All Button */}
      <div className="text-center mt-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          View All Blog Posts
          <FiArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default RecentBlogs;
