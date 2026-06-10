import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '@/shared/components/sections/Hero';
import { Stats } from '@/shared/components/sections/Stats';
import { About } from '@/shared/components/sections/About';
import { Skills } from '@/shared/components/sections/Skills';
import { FeaturedWork } from '@/shared/components/sections/FeaturedWork';
import { ExperiencePreview } from '@/shared/components/sections/ExperiencePreview';
import { ContactCTA } from '@/shared/components/sections/ContactCTA';
import { seo } from '@/content/site';

export const HomePage: React.FC = () => (
  <>
    <Helmet>
      <title>{seo.defaultTitle}</title>
      <meta name="description" content={seo.defaultDescription} />
    </Helmet>
    <Hero />
    <Stats />
    <About />
    <Skills />
    <FeaturedWork />
    <ExperiencePreview />
    <ContactCTA />
  </>
);
