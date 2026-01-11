import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, AlertTriangle, Mail } from 'lucide-react';
import { ROUTES } from '@/core/routes';

export const ServerErrorPage: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>500 - Internal Server Error</title>
        <meta name="description" content="Something went wrong on our end" />
      </Helmet>
      
      <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Animated Warning Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, -5, 5, 0],
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="inline-block p-6 bg-red-100 border-4 border-ink rounded-full"
            >
              <AlertTriangle size={64} className="text-red-600" />
            </motion.div>
          </motion.div>

          {/* Large 500 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="font-display text-[10rem] md:text-[15rem] font-bold text-ink leading-none relative">
              <span className="relative inline-block">
                5
                <motion.div
                  animate={{ 
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-red-500/30 -z-10 blur-xl"
                />
              </span>
              <span className="relative inline-block mx-4">
                0
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                  className="absolute inset-0 bg-orange-500/30 -z-10 blur-xl rounded-full"
                />
              </span>
              <span className="relative inline-block">
                0
                <motion.div
                  animate={{ 
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  }}
                  className="absolute inset-0 bg-red-500/30 -z-10 blur-xl"
                />
              </span>
            </h1>
          </motion.div>
          
          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-2 bg-ink mx-auto mb-8"
            style={{ width: '200px' }}
          />

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-ink mb-4">
              Oops! Something Went Wrong
            </h2>
            
            <p className="font-body text-xl md:text-2xl text-ink/70 max-w-2xl mx-auto leading-relaxed">
              Our servers encountered an unexpected error. This is on us, not you! 
              We're working to fix it. Please try again in a moment.
            </p>
          </motion.div>

          {/* Error Details Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <div className="bg-red-50 border-2 border-red-600 p-6 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-lg font-bold text-red-800 mb-2">
                    What happened?
                  </h3>
                  <p className="font-body text-red-700">
                    The server encountered an internal error and was unable to complete your request. 
                    This could be a temporary issue that will resolve itself shortly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            <button
              onClick={handleRefresh}
              className="group px-8 py-4 bg-ink text-cream hover:bg-accent-dark border-2 border-ink transition-all font-body text-lg flex items-center gap-3 shadow-[6px_6px_0px_0px_rgba(15,15,15,1)] hover:shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw size={24} />
              </motion.div>
              <span>Try Again</span>
            </button>
            
            <Link
              to={ROUTES.HOME}
              className="px-8 py-4 bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-cream transition-all font-body text-lg flex items-center gap-3 shadow-[6px_6px_0px_0px_rgba(15,15,15,1)] hover:shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]"
            >
              <Home size={24} />
              <span>Go Home</span>
            </Link>

            <Link
              to={ROUTES.CONTACT}
              className="px-8 py-4 bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-cream transition-all font-body text-lg flex items-center gap-3 shadow-[6px_6px_0px_0px_rgba(15,15,15,1)] hover:shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]"
            >
              <Mail size={24} />
              <span>Report Issue</span>
            </Link>
          </motion.div>

          {/* Troubleshooting Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-cream border-4 border-ink p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] max-w-3xl mx-auto"
          >
            <h3 className="font-display text-3xl font-bold text-ink mb-6">
              What You Can Try:
            </h3>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🔄</span>
                <div>
                  <h4 className="font-body font-bold text-lg text-ink mb-1">
                    Refresh the Page
                  </h4>
                  <p className="font-body text-ink/70">
                    Click the "Try Again" button or press F5 to reload
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⏱️</span>
                <div>
                  <h4 className="font-body font-bold text-lg text-ink mb-1">
                    Wait a Moment
                  </h4>
                  <p className="font-body text-ink/70">
                    The issue might resolve itself in a minute or two
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🏠</span>
                <div>
                  <h4 className="font-body font-bold text-lg text-ink mb-1">
                    Return Home
                  </h4>
                  <p className="font-body text-ink/70">
                    Navigate back to the homepage and try again
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📧</span>
                <div>
                  <h4 className="font-body font-bold text-lg text-ink mb-1">
                    Contact Support
                  </h4>
                  <p className="font-body text-ink/70">
                    If the problem persists, let me know
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12"
          >
            <details className="text-left max-w-2xl mx-auto">
              <summary className="font-body text-ink/60 cursor-pointer hover:text-ink transition-colors">
                <span className="font-mono">▶ Technical Details</span>
              </summary>
              <div className="mt-4 p-4 bg-ink text-cream font-mono text-sm">
                <div>Error Code: 500</div>
                <div>Error Type: Internal Server Error</div>
                <div>Timestamp: {new Date().toISOString()}</div>
                <div>URL: {window.location.href}</div>
                <div>User Agent: {navigator.userAgent.slice(0, 50)}...</div>
              </div>
            </details>
          </motion.div>

          {/* Reassurance Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="mt-8"
          >
            <p className="font-body text-ink/60 text-lg">
              Don't worry, your data is safe. This error has been logged and 
              we'll investigate it as soon as possible.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};