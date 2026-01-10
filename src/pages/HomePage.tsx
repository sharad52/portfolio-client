import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '@/shared/components/sections/Hero';

export const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home | Developer Portfolio</title>
        <meta name="description" content="Welcome to my developer portfolio - Full Stack Developer crafting elegant solutions" />
      </Helmet>
      <Hero />
    </>
  );
};

export const ProjectsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Projects | Developer Portfolio</title>
      </Helmet>
      <div className="min-h-screen bg-cream py-24">
        <div className="container mx-auto px-6">
          <h1 className="font-display text-6xl font-bold text-ink">Projects</h1>
        </div>
      </div>
    </>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact | Developer Portfolio</title>
      </Helmet>
      <div className="min-h-screen bg-cream py-24">
        <div className="container mx-auto px-6">
          <h1 className="font-display text-6xl font-bold text-ink">Contact</h1>
        </div>
      </div>
    </>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 Not Found</title>
      </Helmet>
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-9xl font-bold text-ink mb-4">404</h1>
          <p className="font-body text-2xl text-ink/70">Page not found</p>
        </div>
      </div>
    </>
  );
};
