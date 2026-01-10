# Architecture Guide

## Why This Architecture?

This portfolio uses a **feature-based** (also called **feature-sliced** or **domain-driven**) architecture instead of a traditional folder-by-type structure. Here's why:

### Problems with Traditional Architecture

```
src/
├── components/        # ALL components (100+ files)
├── services/         # ALL services
├── types/            # ALL types
├── hooks/            # ALL hooks
└── utils/            # ALL utilities
```

**Issues:**
- Hard to find related code
- Difficult to understand feature scope
- Risk of tight coupling
- Hard to delete features cleanly
- Doesn't scale well

### Our Solution: Feature-Based Architecture

```
src/
├── features/          # Each feature is self-contained
│   ├── blog/         # Everything blog-related
│   └── projects/     # Everything projects-related
├── shared/           # Only truly shared code
└── core/             # App-level concerns
```

**Benefits:**
- Related code stays together
- Clear feature boundaries
- Easy to understand scope
- Can delete entire features cleanly
- Scales to any size

## Folder Structure Philosophy

### 1. `/src/features/` - Feature Modules

**Rule:** Each feature owns its own code

```
features/blog/
├── components/       # Blog-specific components
├── services/        # Blog API calls
├── types/           # Blog TypeScript types
├── hooks/           # Blog-specific hooks
└── utils/           # Blog-specific utilities
```

**When to create a new feature:**
- It represents a distinct domain/functionality
- It has its own data models
- It could theoretically be extracted to a separate package

**Examples:**
- `blog/` - Blog posts, categories, tags
- `projects/` - Project showcase
- `auth/` - Authentication (if you add it later)
- `admin/` - Admin panel (if you add it later)

### 2. `/src/shared/` - Shared Resources

**Rule:** Only code used by 2+ features

```
shared/
├── components/ui/    # Button, Card, Modal (used everywhere)
├── hooks/            # useDebounce, useIntersectionObserver
├── utils/            # formatDate, slugify (generic helpers)
└── types/            # ApiResponse, PaginatedResponse
```

**Don't put here:**
- Feature-specific code
- Code used by only one feature
- "Maybe we'll need it" code

**Do put here:**
- Truly reusable UI components
- Generic utilities
- Common TypeScript types
- App-wide constants

### 3. `/src/core/` - Application Core

**Rule:** App-level concerns only

```
core/
├── api/              # API client, interceptors
├── config/           # Environment configuration
└── routes/           # Route definitions
```

**Purpose:**
- API infrastructure
- Global configuration
- Routing setup
- App initialization

### 4. `/src/pages/` - Page Components

**Rule:** One file per route

```
pages/
├── HomePage.tsx      # Route: /
├── BlogPage.tsx      # Route: /blog
└── BlogPostPage.tsx  # Route: /blog/:slug
```

**Purpose:**
- Connect routes to features
- Handle route params
- Compose feature components
- SEO metadata

## Code Organization Principles

### 1. Colocation

**Keep related code close together**

❌ Bad:
```
components/BlogCard.tsx
services/blogService.ts      # Far from BlogCard
types/blog.ts                # Even further
```

✅ Good:
```
features/blog/
├── components/BlogCard.tsx
├── services/blogService.ts  # Right here
└── types/index.ts           # Together
```

### 2. Single Responsibility

Each feature should have ONE clear responsibility:

- `blog/` - Manage blog content
- `projects/` - Showcase projects
- `contact/` - Handle contact forms

### 3. Dependency Flow

```
pages → features → shared → core
```

- **Pages** use **features**
- **Features** use **shared** and **core**
- **Shared** can use **core**
- **Core** is independent

**Never:**
- Core importing from features
- Shared importing from features
- Features importing from pages

### 4. Feature Independence

Features should not import from each other:

❌ Bad:
```typescript
// In features/projects/
import { BlogCard } from '@/features/blog/components/BlogCard'
```

✅ Good - Move to shared:
```typescript
// Move BlogCard to shared/components/ui/
import { Card } from '@/shared/components/ui/Card'
```

## Service Layer Pattern

### Why Services?

Services abstract API calls and business logic:

```typescript
// features/blog/services/blogService.ts
export class BlogService {
  static async getPosts(): Promise<BlogPost[]> {
    return ApiService.get('/blog/posts');
  }
}
```

**Benefits:**
1. **Easy to switch implementations** (mock → real API)
2. **Centralized API logic**
3. **Type-safe**
4. **Testable**
5. **Reusable**

### Service Structure

```typescript
export class BlogService {
  private static readonly BASE_PATH = '/blog';

  // Public API - what components use
  static async getPosts() { }
  static async getPostBySlug(slug: string) { }
  
  // Private helpers if needed
  private static transformPost(data: any) { }
}
```

## Type Safety Strategy

### 1. Feature Types

Each feature defines its own types:

```typescript
// features/blog/types/index.ts
export interface BlogPost {
  id: string;
  title: string;
  // ... blog-specific fields
}
```

### 2. Shared Types

Common types go in shared:

```typescript
// shared/types/common.ts
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: { /*...*/ };
}
```

### 3. Type Composition

Features extend shared types:

```typescript
// features/blog/types/index.ts
import { BaseEntity } from '@/shared/types/common';

export interface BlogPost extends BaseEntity {
  title: string;
  content: string;
}
```

## Adding Backend Integration

### Current State: Mock Data

```typescript
// features/blog/services/blogService.ts
const MOCK_POSTS = [ /* ... */ ];

static async getPosts(): Promise<BlogPost[]> {
  return Promise.resolve(MOCK_POSTS);  // Mock
}
```

### Transition to Real API

1. **Set up environment:**
```bash
# .env
VITE_API_BASE_URL=https://api.yourdomain.com
```

2. **Update service:**
```typescript
static async getPosts(): Promise<BlogPost[]> {
  return ApiService.get('/blog/posts');  // Real API
}
```

3. **No component changes needed!** 🎉

Components don't know or care if data is mock or real.

## Best Practices

### Do's ✅

1. **Keep features independent**
2. **Put shared code in `/shared/`**
3. **Use services for API calls**
4. **Type everything with TypeScript**
5. **Colocate related code**
6. **Follow the dependency flow**

### Don'ts ❌

1. **Don't mix feature code in `/shared/`**
2. **Don't import features from features**
3. **Don't bypass the service layer**
4. **Don't put business logic in components**
5. **Don't create "utils hell" with random helpers**

## Scaling Examples

### Adding Authentication

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── services/
│   └── authService.ts
├── types/
│   └── index.ts        # User, AuthResponse, etc.
└── hooks/
    └── useAuth.ts
```

### Adding Admin Panel

```
src/features/admin/
├── components/
│   ├── Dashboard.tsx
│   ├── PostEditor.tsx
│   └── Analytics.tsx
├── services/
│   └── adminService.ts
└── types/
    └── index.ts
```

### Adding E-Commerce

```
src/features/shop/
├── components/
│   ├── ProductList.tsx
│   ├── Cart.tsx
│   └── Checkout.tsx
├── services/
│   ├── productService.ts
│   └── orderService.ts
└── types/
    └── index.ts        # Product, Order, etc.
```

## File Naming Conventions

- **Components:** `PascalCase.tsx` (BlogCard.tsx)
- **Services:** `camelCase.ts` (blogService.ts)
- **Types:** `index.ts` (export from features/blog/types/index.ts)
- **Utils:** `camelCase.ts` (formatDate.ts)
- **Hooks:** `camelCase.ts` (useBlogPosts.ts)

## When to Refactor

### Move to `/shared/` when:
- Used by 2+ features
- Truly generic (not feature-specific)
- Stable (not changing frequently)

### Create new feature when:
- Distinct domain/responsibility
- Has own data models
- Could be separate package

### Extract to service when:
- API call logic
- Complex data transformation
- Reused across components

## Testing Strategy

```typescript
// features/blog/__tests__/blogService.test.ts
import { BlogService } from '../services/blogService';

describe('BlogService', () => {
  it('should fetch posts', async () => {
    const posts = await BlogService.getPosts();
    expect(posts).toBeDefined();
  });
});
```

Each feature can have its own test folder following the same structure.

## Migration Path

If you're migrating from traditional structure:

1. **Create feature folders**
2. **Move related files together**
3. **Update imports**
4. **Extract shared code**
5. **Test thoroughly**

Take it one feature at a time!

## Summary

This architecture:
- ✅ Scales from small to large
- ✅ Easy to understand and navigate
- ✅ Supports team collaboration
- ✅ Makes backend integration simple
- ✅ Enables clean feature additions/removals
- ✅ Promotes code reusability

**Remember:** The goal is maintainability and scalability. This structure grows with your needs without becoming overwhelming.
