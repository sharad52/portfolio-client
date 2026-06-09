import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';
import { ROUTES } from '@/core/routes';
import { AuroraBackground, MagneticButton } from '@/shared/components/ui';

export const ServerErrorPage: React.FC = () => (
  <>
    <Helmet>
      <title>500 — Something went wrong</title>
    </Helmet>

    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <AuroraBackground />
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="font-display text-[8rem] font-medium leading-none tracking-tight md:text-[12rem]"
        >
          <span className="gradient-text-animated">500</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-4 max-w-md text-lg text-fg-muted"
        >
          Something broke on our end. It's not you — try again in a moment.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <MagneticButton>
            <button onClick={() => window.location.reload()} className="btn-primary"><RefreshCw size={18} /> Try again</button>
          </MagneticButton>
          <MagneticButton>
            <Link to={ROUTES.HOME} className="btn-ghost"><Home size={16} /> Go home</Link>
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  </>
);
