import React from "react";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-300">
      
      {/* IMAGE */}
      <img
        src={project.image?.value || 'https://placehold.co/400x300/e2e8f0/475569?text=No+Image'}
        alt={project.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = 'https://placehold.co/400x300/e2e8f0/475569?text=No+Image';
        }}
      />

      {/* CONTENT */}
      <div className="p-4">
        <h2 className="text-xl font-semibold">{project.title}</h2>
        <p className="text-gray-400 mt-2 text-sm">
          {project.description}
        </p>

        {/* TECH STACK */}
        <div className="flex flex-wrap gap-2 mt-3">
          {project.techStack?.map((tech, i) => (
            <span
              key={i}
              className="bg-primary px-2 py-1 text-xs rounded"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* LINKS */}
        <div className="flex gap-4 mt-4">
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Live
            </a>
          )}
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;