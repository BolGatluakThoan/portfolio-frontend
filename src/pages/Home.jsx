import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import LoadingSpinner from "../components/LoadingSpinner";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import FeaturedProjects from "../components/FeaturedProjects";
import RecentBlogs from "../components/RecentBlogs";
import SEO from "../components/SEO";
import api from "../services/api";

const Home = () => {
  const [content, setContent] = useState({
    hero: null,
    about: null,
    skills: [],
    featuredProjects: [],
    recentBlogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [
          heroRes,
          aboutRes,
          skillsRes,
          projectsRes,
          blogsRes,
          settingsRes,
        ] = await Promise.all([
          api.get("/hero"),
          api.get("/about"),
          api.get("/skills"),
          api.get("/projects"),
          api.get("/blogs"), // Fetch published blogs
          api.get("/settings"),
        ]);

        // Get only the latest 3 published blogs
        const latestBlogs = (blogsRes.data.blogs || []).slice(0, 3);

        setContent({
          hero: heroRes.data,
          about: aboutRes.data,
          skills: skillsRes.data,
          featuredProjects: projectsRes.data
            .filter((p) => p.featured)
            .slice(0, 3),
          recentBlogs: latestBlogs,
        });
        setSettings(settingsRes.data);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <SEO
        title="Home"
        description={
          settings?.siteDescription ||
          "Professional portfolio showcasing projects, skills, and experience"
        }
      />

      <div className="space-y-16">
        {content.hero && <Hero data={content.hero} />}
        {content.about && <About data={content.about} />}
        {content.skills.length > 0 && <Skills skills={content.skills} />}

        {/* Recent Blog Posts - Shows only if there are blogs */}
        {content.recentBlogs.length > 0 && (
          <RecentBlogs blogs={content.recentBlogs} />
        )}

        {content.featuredProjects.length > 0 && (
          <FeaturedProjects projects={content.featuredProjects} />
        )}
      </div>
    </>
  );
};

export default Home;
