import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter, CheckCircle } from 'lucide-react';
import { ContactService } from '@/features/contact/services/contactService';
import { ContactFormData } from '@/features/contact/types';
import { SOCIAL_LINKS } from '@/shared/constants';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await ContactService.submitForm(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('Failed to send message. Please try again or email me directly.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | Senior Software Engineer</title>
        <meta name="description" content="Get in touch to discuss opportunities, collaborations, or projects" />
      </Helmet>

      <div className="min-h-screen bg-cream py-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="font-display text-6xl md:text-7xl font-bold text-ink mb-4">
              Let's Connect
            </h1>
            <div className="h-1 w-32 bg-accent mx-auto mb-6" />
            <p className="font-body text-xl text-ink/70 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities, interesting projects, 
              or potential collaborations. Feel free to reach out!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-ink text-cream p-8 md:p-12 border-2 border-ink shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] h-full">
                <h2 className="font-display text-3xl font-bold mb-6">
                  Contact Information
                </h2>
                
                <p className="font-body text-lg text-cream/80 mb-8">
                  I'm currently open to full-time opportunities, freelance projects, 
                  and consulting engagements. Let's build something amazing together.
                </p>

                {/* Contact Details */}
                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <Mail className="text-accent mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-body text-sm text-cream/60 mb-1">Email</p>
                      <a 
                        href="mailto:your.email@example.com"
                        className="font-body text-lg hover:text-accent transition-colors"
                      >
                        ersharadbhandari@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="text-accent mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-body text-sm text-cream/60 mb-1">Phone</p>
                      <a 
                        href="tel:+1234567890"
                        className="font-body text-lg hover:text-accent transition-colors"
                      >
                        +977-9847895491
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="text-accent mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-body text-sm text-cream/60 mb-1">Location</p>
                      <p className="font-body text-lg">
                        Kathmandu, Nepal
                      </p>
                      <p className="font-body text-sm text-cream/60">
                        Open to remote opportunities
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="border-t border-cream/20 pt-8">
                  <p className="font-body text-sm text-cream/60 mb-4">
                    Connect with me
                  </p>
                  <div className="flex gap-4">
                    <a
                      href={SOCIAL_LINKS.GITHUB}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream hover:text-accent transition-colors"
                      aria-label="GitHub"
                    >
                      <Github size={28} />
                    </a>
                    <a
                      href={SOCIAL_LINKS.LINKEDIN}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream hover:text-accent transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={28} />
                    </a>
                    <a
                      href={SOCIAL_LINKS.TWITTER}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream hover:text-accent transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter size={28} />
                    </a>
                  </div>
                </div>

                {/* Availability Badge */}
                <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-sm text-accent">
                    Available for opportunities
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-cream border-2 border-ink p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(15,15,15,1)]">
                {isSubmitted ? (
                  // Success Message
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="text-accent mx-auto mb-4" size={64} />
                    <h3 className="font-display text-3xl font-bold text-ink mb-3">
                      Message Sent!
                    </h3>
                    <p className="font-body text-lg text-ink/70 mb-6">
                      Thank you for reaching out. I'll get back to you within 24-48 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2 bg-ink text-cream hover:bg-accent-dark transition-colors font-body"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  // Contact Form
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block font-body text-lg text-ink mb-2"
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-ink bg-cream font-body text-lg 
                                 focus:outline-none focus:border-accent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block font-body text-lg text-ink mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-ink bg-cream font-body text-lg 
                                 focus:outline-none focus:border-accent transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block font-body text-lg text-ink mb-2"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-ink bg-cream font-body text-lg 
                                 focus:outline-none focus:border-accent transition-colors"
                        placeholder="Project Inquiry / Job Opportunity / Collaboration"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block font-body text-lg text-ink mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-ink bg-cream font-body text-lg 
                                 focus:outline-none focus:border-accent transition-colors resize-none"
                        placeholder="Tell me about your project, opportunity, or how we can work together..."
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border-2 border-red-600 text-red-600">
                        <p className="font-body">{error}</p>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-8 py-4 font-body text-lg transition-all 
                               flex items-center justify-center gap-3
                               ${isSubmitting 
                                 ? 'bg-ink/50 text-cream cursor-not-allowed' 
                                 : 'bg-ink text-cream hover:bg-accent-dark border-2 border-ink'
                               }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-cream border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={20} />
                        </>
                      )}
                    </motion.button>

                    <p className="text-sm text-ink/60 text-center font-body">
                      * Required fields
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="max-w-3xl mx-auto bg-accent/10 border-2 border-accent p-8">
              <h3 className="font-display text-2xl font-bold text-ink mb-4">
                Looking for a Senior Software Engineer?
              </h3>
              <p className="font-body text-lg text-ink/80 mb-6">
                I specialize in building scalable web applications, architecting cloud infrastructure, 
                and leading development teams. With 8+ years of experience in React, Node.js, TypeScript, 
                and AWS, I can help bring your project to life.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-ink text-cream font-mono text-sm">
                  Full-Stack Development
                </span>
                <span className="px-4 py-2 bg-ink text-cream font-mono text-sm">
                  System Architecture
                </span>
                <span className="px-4 py-2 bg-ink text-cream font-mono text-sm">
                  Technical Leadership
                </span>
                <span className="px-4 py-2 bg-ink text-cream font-mono text-sm">
                  Cloud Infrastructure
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};