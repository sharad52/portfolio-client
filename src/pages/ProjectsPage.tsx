import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Github } from 'lucide-react';
import { ProjectService } from '@/features/projects/services/projectService';
import { Project } from '@/features/projects/types';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await ProjectService.getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <>
      <Helmet>
        <title>Projects | Developer Portfolio</title>
        <meta name="description" content="Check out my portfolio of web development projects" />
      </Helmet>

      <div className="min-h-screen bg-cream py-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="font-display text-6xl md:text-7xl font-bold text-ink mb-4">
              Projects
            </h1>
            <div className="h-1 w-32 bg-accent mb-6" />
            <p className="font-body text-xl text-ink/70 max-w-2xl">
              A collection of projects I've built, showcasing my skills in web development,
              design, and problem-solving.
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-xl text-red-600">{error}</p>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-ink/60">No projects yet. Check back soon!</p>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-cream border-2 border-ink shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] hover:shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] transition-all duration-300 relative"
                >
                  {/* Project Image */}
                  {project.coverImage && (
                    <div className="overflow-hidden border-b-2 border-ink">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback if image doesn't load
                          e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23c9a96e' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%23faf8f4' text-anchor='middle' dy='.3em' font-family='serif'%3E${encodeURIComponent(project.title)}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                    </div>
                  )}

                  {/* Project Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 bg-accent/20 text-ink font-mono text-sm mb-3">
                      {project.category.name}
                    </span>

                    {/* Title */}
                    <h3 className="font-display text-2xl font-bold text-ink mb-3">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="font-body text-ink/70 mb-4 line-clamp-3">
                      {project.longDescription || project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech.id}
                          className="px-2 py-1 bg-ink text-cream text-xs font-mono"
                        >
                          {tech.name}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-ink/20 text-ink text-xs font-mono">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex gap-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-ink hover:text-accent transition-colors font-body"
                        >
                          <Github size={18} />
                          <span className="text-sm">Code</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-ink hover:text-accent transition-colors font-body"
                        >
                          <ExternalLink size={18} />
                          <span className="text-sm">Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-accent text-ink font-mono text-xs border-2 border-ink shadow-md">
                        Featured
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};