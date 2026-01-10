export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:slug',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  BLOG_CATEGORY: '/blog/category/:category',
  BLOG_TAG: '/blog/tag/:tag',
  EXPERIENCE: '/experience',
  SKILLS: '/skills',
  CONTACT: '/contact',
  ADMIN: '/admin',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_PROJECTS: '/admin/projects',
  NOT_FOUND: '*',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];

// Helper functions for dynamic routes
export const createProjectRoute = (slug: string): string => 
  ROUTES.PROJECT_DETAIL.replace(':slug', slug);

export const createBlogPostRoute = (slug: string): string => 
  ROUTES.BLOG_POST.replace(':slug', slug);

export const createBlogCategoryRoute = (category: string): string => 
  ROUTES.BLOG_CATEGORY.replace(':category', category);

export const createBlogTagRoute = (tag: string): string => 
  ROUTES.BLOG_TAG.replace(':tag', tag);
