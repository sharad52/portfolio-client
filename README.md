# Developer Portfolio V2 - Scalable Architecture

A modern, feature-rich portfolio built with **React**, **TypeScript**, and a **scalable architecture** designed to support future backend integration and blog functionality.

## 🎯 Key Features

- ✅ **Scalable Feature-Based Architecture** - Organized by features, not file types
- ✅ **Blog System Ready** - Full blog infrastructure with posts, categories, tags
- ✅ **Backend Integration Ready** - API client with interceptors, services layer
- ✅ **Type-Safe** - Full TypeScript coverage with strict mode
- ✅ **SEO Optimized** - React Helmet for meta tags, structured data ready
- ✅ **Routing** - React Router with lazy loading support
- ✅ **State Management Ready** - Zustand integration for complex state
- ✅ **API Layer** - Axios client with interceptors and error handling
- ✅ **Reusable Services** - Abstracted API calls for easy backend switching

## 🏗️ Architecture Overview

This project follows a **feature-based architecture** where code is organized by feature/domain rather than by file type. This approach scales better as the application grows.

```
src/
├── app/                    # App-level configuration
├── features/               # Feature modules (self-contained)
│   ├── blog/              # Blog feature
│   │   ├── components/    # Blog-specific components
│   │   ├── hooks/         # Blog-specific hooks
│   │   ├── services/      # Blog API services
│   │   ├── types/         # Blog TypeScript types
│   │   └── utils/         # Blog utilities
│   ├── projects/          # Projects feature
│   ├── experience/        # Experience feature
│   ├── skills/            # Skills feature
│   └── contact/           # Contact feature
├── shared/                # Shared across features
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Shared custom hooks
│   ├── utils/            # Utility functions
│   ├── types/            # Common TypeScript types
│   ├── constants/        # App constants
│   └── styles/           # Global styles
├── core/                 # Core app functionality
│   ├── api/             # API client configuration
│   ├── config/          # App configuration
│   └── routes/          # Route definitions
└── pages/               # Page components
```

## 📁 Detailed Folder Structure

### `/src/features/` - Feature Modules

Each feature is self-contained with its own components, services, types, and logic:

- **`blog/`** - Complete blog system
  - `components/` - BlogCard, BlogList, BlogPost, etc.
  - `services/` - API calls for blog operations
  - `types/` - BlogPost, Category, Tag, Comment interfaces
  - `hooks/` - useBlogPosts, useBlogPost, etc.

- **`projects/`** - Project showcase
- **`experience/`** - Work experience timeline
- **`skills/`** - Skills and technologies
- **`contact/`** - Contact form

### `/src/shared/` - Shared Resources

Reusable code shared across multiple features:

- `components/ui/` - Button, Card, Modal, Input, etc.
- `components/layout/` - Header, Footer, Sidebar
- `hooks/` - useIntersectionObserver, useDebounce, etc.
- `utils/` - Date formatting, string manipulation, etc.
- `types/` - Common interfaces and types
- `constants/` - App-wide constants

### `/src/core/` - Core Application

- `api/` - Axios client with interceptors
- `config/` - Environment configuration
- `routes/` - Route definitions and helpers

## 🔌 Backend Integration

### API Client (`/src/core/api/apiClient.ts`)

The app includes a pre-configured API client with:

- **Axios interceptors** for auth tokens
- **Error handling** and logging
- **Request/response transformation**
- **Generic API methods** (GET, POST, PUT, DELETE)

```typescript
// Example usage
import { ApiService } from '@/core/api/apiClient';

const data = await ApiService.get<User[]>('/users');
```

### Service Layer Pattern

Each feature has its own service for API calls:

```typescript
// /src/features/blog/services/blogService.ts
export class BlogService {
  static async getPosts(params?: PaginationParams): Promise<PaginatedResponse<BlogPost>> {
    return ApiService.get<PaginatedResponse<BlogPost>>('/blog/posts', { params });
  }
}
```

**Benefits:**
- Easy to switch between mock data and real API
- Centralized API logic
- Type-safe requests and responses
- Simple to test

### Environment Configuration

Configure your backend URL in `.env`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
# Or for production
VITE_API_BASE_URL=https://api.yourdomain.com
```

## 📝 Blog System

The blog system is fully implemented and ready to connect to a backend:

### Features

- ✅ Blog post listing with pagination
- ✅ Individual blog post pages
- ✅ Categories and tags
- ✅ Reading time calculation
- ✅ Author information
- ✅ SEO metadata support
- ✅ Markdown content rendering
- ✅ Comments system (structure ready)

### Mock Data vs. Real API

Currently uses mock data for demonstration. To connect to real API:

1. Update `BlogService` methods to remove mock implementations
2. Uncomment the real API calls
3. Configure `VITE_API_BASE_URL` in `.env`

```typescript
// Before (mock)
static async getPosts(): Promise<BlogPost[]> {
  return Promise.resolve(MOCK_POSTS);
}

// After (real API)
static async getPosts(): Promise<BlogPost[]> {
  return ApiService.get<BlogPost[]>('/blog/posts');
}
```

## 🛠️ Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router DOM** - Routing

### Styling
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations

### API & Data
- **Axios** - HTTP client
- **React Query** - Server state management (installed)
- **Zustand** - Client state management (installed)

### Utilities
- **date-fns** - Date manipulation
- **markdown-to-jsx** - Markdown rendering
- **React Helmet Async** - SEO meta tags
- **Lucide React** - Icons

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📝 Adding New Features

### 1. Create Feature Folder

```bash
mkdir -p src/features/new-feature/{components,services,types,hooks}
```

### 2. Define Types

```typescript
// src/features/new-feature/types/index.ts
export interface NewFeatureItem {
  id: string;
  title: string;
  // ... other fields
}
```

### 3. Create Service

```typescript
// src/features/new-feature/services/newFeatureService.ts
import { ApiService } from '@/core/api/apiClient';

export class NewFeatureService {
  static async getItems(): Promise<NewFeatureItem[]> {
    return ApiService.get('/new-feature/items');
  }
}
```

### 4. Create Components

```typescript
// src/features/new-feature/components/NewFeatureList.tsx
import { NewFeatureService } from '../services/newFeatureService';

export const NewFeatureList: React.FC = () => {
  // Component logic
};
```

### 5. Add Routes

```typescript
// src/core/routes/index.ts
export const ROUTES = {
  // ... existing routes
  NEW_FEATURE: '/new-feature',
};
```

## 🔄 Connecting to Backend

### Step 1: Set Up Your Backend

Your backend should provide these endpoints (example for blog):

```
GET    /api/blog/posts              # List all posts
GET    /api/blog/posts/:slug        # Get single post
POST   /api/blog/posts              # Create post (admin)
PUT    /api/blog/posts/:id          # Update post (admin)
DELETE /api/blog/posts/:id          # Delete post (admin)
GET    /api/blog/posts/:id/comments # Get comments
POST   /api/blog/posts/:id/comments # Add comment
```

### Step 2: Update Environment

```bash
# .env
VITE_API_BASE_URL=https://your-api.com/api
```

### Step 3: Update Services

Remove mock data and use real API calls:

```typescript
// src/features/blog/services/blogService.ts
static async getPosts(): Promise<PaginatedResponse<BlogPost>> {
  return ApiService.get('/blog/posts');
}
```

### Step 4: Add Authentication (if needed)

The API client already handles auth tokens:

```typescript
// After login, store token
localStorage.setItem('auth_token', token);

// API client automatically adds it to requests
// Authorization: Bearer <token>
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'ink': '#0f0f0f',      // Change to your dark color
  'cream': '#faf8f4',    // Change to your light color
  'accent': '#c9a96e',   // Change to your accent color
}
```

### Fonts

Update `tailwind.config.js` and `src/shared/styles/index.css`:

```javascript
fontFamily: {
  'display': ['Your Display Font', 'serif'],
  'body': ['Your Body Font', 'serif'],
}
```

### Content

- **Blog Posts**: Edit `src/features/blog/services/blogService.ts` (MOCK_POSTS)
- **Projects**: Edit `src/features/projects/services/projectService.ts`
- **Social Links**: Edit `src/shared/constants/index.ts`

## 📦 Building for Production

```bash
# Build the app
npm run build

# The built files will be in /dist folder
```

Deploy to:
- **Vercel** - `vercel deploy`
- **Netlify** - `netlify deploy`
- **GitHub Pages** - Configure GitHub Actions
- **Any static hosting** - Upload `dist/` folder

## 🔐 Environment Variables

Create `.env` file (use `.env.example` as template):

```bash
# Required
VITE_API_BASE_URL=http://localhost:3000/api

# Optional
VITE_APP_NAME=My Portfolio
VITE_ENABLE_BLOG=true
VITE_ENABLE_COMMENTS=false
VITE_ENABLE_ANALYTICS=false
```

## 🧪 Testing (Setup Ready)

The architecture is designed for easy testing:

```typescript
// Example test
import { BlogService } from '@/features/blog/services/blogService';

describe('BlogService', () => {
  it('should fetch blog posts', async () => {
    const posts = await BlogService.getPosts();
    expect(posts).toBeDefined();
  });
});
```

## 📚 Key Concepts

### Feature-Based Organization

Instead of grouping by file type (all components together), we group by feature:

**❌ Traditional (doesn't scale):**
```
components/
  BlogCard.tsx
  ProjectCard.tsx
  ContactForm.tsx
services/
  blogService.ts
  projectService.ts
```

**✅ Feature-Based (scales well):**
```
features/
  blog/
    components/BlogCard.tsx
    services/blogService.ts
  projects/
    components/ProjectCard.tsx
    services/projectService.ts
```

### Benefits

1. **Scalability** - Easy to add new features without file explosion
2. **Maintainability** - Related code stays together
3. **Reusability** - Shared code in `/shared`, feature code isolated
4. **Team collaboration** - Multiple developers can work on different features
5. **Code splitting** - Easier to lazy load entire features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use for your own portfolio!

## 🆘 Support

For questions or issues:
- Open an issue on GitHub
- Check the documentation
- Review example implementations in `/src/features/`

---

**Built with ❤️ using modern React architecture patterns**
