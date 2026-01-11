import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Calendar, MapPin, Award } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  companyUrl?: string;
}

// Mock data - Replace with your actual experience
const EXPERIENCES: Experience[] = [
  {
    id: '1',
    company: 'Tech Innovations Inc.',
    position: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    startDate: 'Jan 2022',
    endDate: 'Present',
    current: true,
    description: 'Leading full-stack development for enterprise SaaS platform serving 10,000+ users',
    achievements: [
      'Architected and implemented microservices architecture reducing API response time by 60%',
      'Led team of 5 engineers in delivering critical features ahead of schedule',
      'Mentored 3 junior developers, conducting code reviews and technical guidance',
      'Reduced production bugs by 40% through implementation of comprehensive testing strategy',
      'Designed and built scalable CI/CD pipeline reducing deployment time from 2 hours to 15 minutes'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'Docker', 'Kubernetes'],
    companyUrl: 'https://techinnovations.com',
  },
  {
    id: '2',
    company: 'Digital Solutions Corp',
    position: 'Full Stack Developer',
    location: 'Remote',
    startDate: 'Mar 2020',
    endDate: 'Dec 2021',
    current: false,
    description: 'Developed and maintained multiple client-facing web applications and internal tools',
    achievements: [
      'Built 8+ full-stack applications from scratch serving clients across various industries',
      'Implemented RESTful APIs handling 1M+ requests daily with 99.9% uptime',
      'Collaborated with UX team to improve user engagement by 35%',
      'Integrated third-party payment systems (Stripe, PayPal) processing $2M+ annually',
      'Optimized database queries reducing load times by 50%'
    ],
    technologies: ['React', 'Vue.js', 'Express', 'MongoDB', 'Redis', 'GraphQL'],
    companyUrl: 'https://digitalsolutions.com',
  },
  {
    id: '3',
    company: 'StartupXYZ',
    position: 'Software Engineer',
    location: 'New York, NY',
    startDate: 'Jun 2019',
    endDate: 'Feb 2020',
    current: false,
    description: 'Contributed to product development in fast-paced startup environment',
    achievements: [
      'Developed responsive UI components used across 15+ product pages',
      'Participated in agile development process with 2-week sprint cycles',
      'Collaborated with product team to define technical requirements',
      'Fixed 100+ bugs and implemented performance improvements',
      'Contributed to open-source libraries used by the engineering team'
    ],
    technologies: ['React', 'JavaScript', 'Node.js', 'MySQL', 'Git'],
  },
];

export const ExperiencePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Experience | Senior Software Engineer</title>
        <meta name="description" content="Professional experience and career journey as a software engineer" />
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
              Professional Experience
            </h1>
            <div className="h-1 w-32 bg-accent mb-6" />
            <p className="font-body text-xl text-ink/70 max-w-3xl">
              Over 5+ years of experience building scalable web applications, leading development teams, 
              and delivering high-impact solutions for companies ranging from startups to enterprises.
            </p>
          </motion.div>

          {/* Experience Timeline */}
          <div className="max-w-5xl mx-auto">
            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-8 md:pl-12 pb-16 last:pb-0"
              >
                {/* Timeline Line */}
                {index !== EXPERIENCES.length - 1 && (
                  <div className="absolute left-[15px] md:left-[23px] top-12 bottom-0 w-0.5 bg-accent/30" />
                )}

                {/* Timeline Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.2 }}
                  className={`absolute left-0 md:left-2 top-2 w-8 h-8 rounded-full border-4 border-cream flex items-center justify-center ${
                    exp.current ? 'bg-accent animate-pulse' : 'bg-ink'
                  }`}
                >
                  <Briefcase size={16} className="text-cream" />
                </motion.div>

                {/* Experience Card */}
                <div className="bg-cream border-2 border-ink p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] hover:shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] transition-all duration-300 ml-4 md:ml-8">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-display text-3xl font-bold text-ink mb-2">
                          {exp.position}
                        </h3>
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-2xl text-accent-dark hover:text-accent transition-colors"
                        >
                          {exp.company}
                        </a>
                      </div>
                      {exp.current && (
                        <span className="px-4 py-2 bg-accent text-ink font-mono text-sm border-2 border-ink">
                          Current Role
                        </span>
                      )}
                    </div>

                    {/* Meta Information */}
                    <div className="flex flex-wrap gap-4 text-ink/60 font-body">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <span>
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-body text-lg text-ink/80 mb-6 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Award size={20} className="text-accent" />
                      <h4 className="font-display text-xl font-bold text-ink">
                        Key Achievements
                      </h4>
                    </div>
                    <ul className="space-y-3">
                      {exp.achievements.map((achievement, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.3 + i * 0.1 }}
                          className="flex items-start gap-3 font-body text-ink/70"
                        >
                          <span className="text-accent mt-1 flex-shrink-0">▸</span>
                          <span>{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="font-body text-sm text-ink/60 mb-3">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-ink text-cream font-mono text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { label: 'Years Experience', value: '5+' },
              { label: 'Companies Worked', value: '3' },
              { label: 'Projects Delivered', value: '20+' },
              { label: 'Team Members Led', value: '5+' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-ink text-cream p-6 text-center border-2 border-ink shadow-[6px_6px_0px_0px_rgba(15,15,15,1)]"
              >
                <div className="font-display text-4xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="font-body text-sm text-cream/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="max-w-2xl mx-auto bg-accent/10 border-2 border-accent p-8">
              <h3 className="font-display text-2xl font-bold text-ink mb-4">
                Interested in working together?
              </h3>
              <p className="font-body text-lg text-ink/80 mb-6">
                I'm always open to discussing new opportunities and interesting projects.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-ink text-cream hover:bg-accent-dark border-2 border-ink transition-all font-body text-lg"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};