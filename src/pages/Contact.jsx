import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import api from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactInfo, setContactInfo] = useState(null);
  const [settings, setSettings] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactRes, settingsRes] = await Promise.all([
          api.get("/contact"),
          api.get("/settings"),
        ]);
        setContactInfo(contactRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error("Failed to fetch contact data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post("/messages", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{settings?.siteTitle || "Portfolio"} | Contact</title>
      </Helmet>

      <div className="py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl font-bold text-center mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Get In Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-center mb-12 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          I'd love to hear from you. Send me a message!
        </motion.p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div
              className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Contact Information
              </h2>
              <div className="space-y-4">
                {contactInfo?.email && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/20">
                      <FiMail className="text-primary-600" size={20} />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Email
                      </p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className={`${theme === "dark" ? "text-gray-200 hover:text-primary-400" : "text-gray-700 hover:text-primary-600"} transition-colors`}
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                {contactInfo?.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/20">
                      <FiPhone className="text-primary-600" size={20} />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Phone
                      </p>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className={`${theme === "dark" ? "text-gray-200 hover:text-primary-400" : "text-gray-700 hover:text-primary-600"} transition-colors`}
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}
                {contactInfo?.address && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/20">
                      <FiMapPin className="text-primary-600" size={20} />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Address
                      </p>
                      <p
                        className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"} transition-colors`}
                      >
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div
              className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}
            >
              <h2
                className={`text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Send a Message
              </h2>

              {success && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
                  <FiCheckCircle size={20} />
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
