//import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ROUTES } from '@/core/routes';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { useGlobalErrorHandler } from '@/shared/utils/errorHandler';

// Layout
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';

// Pages
import { HomePage } from '@/pages/HomePage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ExperiencePage } from '@/pages/ExperiencePage';
import { ContactPage } from '@/pages/ContactPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ServerErrorPage } from '@/pages/ServerErrorPage';

// Inner App component to use hooks
function AppContent() {
  // Global error handler - catches unhandled promise rejections
  useGlobalErrorHandler();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.BLOG} element={<BlogPage />} />
          <Route path={ROUTES.BLOG_POST} element={<BlogPostPage />} />
          <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
          <Route path={ROUTES.EXPERIENCE} element={<ExperiencePage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          {/* Error pages - must come before catch-all */}
          <Route path="/error" element={<ServerErrorPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          {/* 404 catch-all - must be LAST */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;