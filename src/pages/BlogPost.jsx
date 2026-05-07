import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  FiCalendar,
  FiUser,
  FiArrowLeft,
  FiTag,
  FiShare2,
  FiClock,
  FiCopy,
  FiCheck,
  FiTwitter,
  FiLinkedin,
  FiFacebook,
} from "react-icons/fi";
import api from "../services/api";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef(null);
  const shareButtonRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const [blogRes, settingsRes] = await Promise.all([
          api.get(`/blogs/${slug}`),
          api.get("/settings"),
        ]);
        setBlog(blogRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        if (error.response?.status === 404) {
          navigate("/blog");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, navigate]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showShareMenu &&
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target)
      ) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareMenu]);

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 1500);
    }
  };

  const shareOnTwitter = (e) => {
    e.stopPropagation();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
    setShowShareMenu(false);
  };

  const shareOnLinkedIn = (e) => {
    e.stopPropagation();
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}&summary=${encodeURIComponent(blog.excerpt)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    setShowShareMenu(false);
  };

  const shareOnFacebook = (e) => {
    e.stopPropagation();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h2
          className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Blog Post Not Found
        </h2>
        <Link
          to="/blog"
          className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-2"
        >
          <FiArrowLeft size={18} />
          Back to Blog
        </Link>
      </div>
    );
  }

  // Calculate reading time (approx 200 words per minute)
  const readingTime = Math.ceil(blog.content.split(/\s+/).length / 200);

  return (
    <>
      <Helmet>
        <title>
          {blog.title} | {settings?.siteTitle || "Portfolio"}
        </title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        {blog.image?.value && (
          <meta property="og:image" content={blog.image.value} />
        )}
      </Helmet>

      <article className="py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 sm:px-6"
        >
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 group"
          >
            <FiArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Back to Blog</span>
          </Link>

          {/* Featured Image */}
          {blog.image?.value && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={blog.image.value}
                alt={blog.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h1
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <span
              className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              <FiCalendar size={16} />
              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            </span>
            <span
              className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              <FiClock size={16} />
              {readingTime} min read
            </span>
            <span
              className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              <FiUser size={16} />
              {blog.views || 0} views
            </span>

            {/* Share Button with Dropdown Menu */}
            <div className="relative ml-auto">
              <button
                ref={shareButtonRef}
                onClick={handleShare}
                className={`flex items-center gap-1 transition-colors ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-primary-400"
                    : "text-gray-500 hover:text-primary-600"
                }`}
              >
                <FiShare2 size={16} />
                Share
              </button>

              {/* Share Dropdown Menu */}
              {showShareMenu && (
                <div
                  ref={shareMenuRef}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg overflow-hidden z-50 animate-fadeIn"
                >
                  <div
                    className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} divide-y divide-gray-200 dark:divide-gray-700`}
                  >
                    {/* Copy Link Option */}
                    <button
                      onClick={copyToClipboard}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {copied ? (
                        <FiCheck size={16} className="text-green-500" />
                      ) : (
                        <FiCopy size={16} />
                      )}
                      {copied ? "Link Copied!" : "Copy Link"}
                    </button>

                    {/* Twitter */}
                    <button
                      onClick={shareOnTwitter}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FiTwitter size={16} className="text-[#1DA1F2]" />
                      Share on Twitter
                    </button>

                    {/* LinkedIn */}
                    <button
                      onClick={shareOnLinkedIn}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FiLinkedin size={16} className="text-[#0A66C2]" />
                      Share on LinkedIn
                    </button>

                    {/* Facebook */}
                    <button
                      onClick={shareOnFacebook}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FiFacebook size={16} className="text-[#1877F2]" />
                      Share on Facebook
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <FiTag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className={`prose prose-lg max-w-none
              ${theme === "dark" ? "prose-invert" : ""}
              prose-headings:font-bold 
              prose-headings:${theme === "dark" ? "text-white" : "text-gray-900"}
              prose-p:${theme === "dark" ? "text-gray-300" : "text-gray-700"}
              prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:${theme === "dark" ? "text-white" : "text-gray-900"}
              prose-code:${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"}
              prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-l-4 prose-blockquote:border-primary-500 
              prose-blockquote:${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}
              prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl
              prose-blockquote:${theme === "dark" ? "text-gray-300" : "text-gray-600"}
              prose-ul:${theme === "dark" ? "text-gray-300" : "text-gray-700"}
              prose-ol:${theme === "dark" ? "text-gray-300" : "text-gray-700"}
              prose-li:${theme === "dark" ? "text-gray-300" : "text-gray-700"}
            `}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Footer Navigation */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <FiArrowLeft size={16} />
              All Posts
            </Link>
          </div>
        </motion.div>
      </article>
    </>
  );
};

export default BlogPost;
