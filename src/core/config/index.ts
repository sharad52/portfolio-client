// Environment configuration
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Developer Portfolio',
    version: import.meta.env.VITE_APP_VERSION || '2.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  features: {
    enableBlog: import.meta.env.VITE_ENABLE_BLOG !== 'false',
    enableComments: import.meta.env.VITE_ENABLE_COMMENTS === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
  storage: {
    tokenKey: 'auth_token',
    userKey: 'user_data',
  },
} as const;

export type Config = typeof config;
