# Images Folder

This folder contains all static images for your portfolio.

## 📁 Folder Structure

```
images/
├── profile.jpg              # Your professional headshot
├── hero-background.jpg      # Hero section background
├── about-photo.jpg          # About section photo
│
├── projects/                # Project screenshots and covers
│   ├── project-1-cover.jpg
│   ├── project-1-screenshot-1.jpg
│   └── project-2-cover.jpg
│
├── blog/                    # Blog post cover images
│   ├── post-1-cover.jpg
│   └── default-cover.jpg
│
├── tech-icons/              # Technology logos (React, Node, etc.)
│   ├── react.svg
│   ├── typescript.svg
│   └── nodejs.svg
│
└── company-logos/           # Company logos for experience section
    ├── company-1.png
    └── company-2.png
```

## 🖼️ How to Use

### In Your Components:

```typescript
// Use absolute path from /public
<img src="/images/profile.jpg" alt="Your Name" />
<img src="/images/projects/ecommerce.jpg" alt="Project" />
```

### In Mock Data:

```typescript
// src/features/blog/services/blogService.ts
const MOCK_POSTS: BlogPost[] = [
  {
    coverImage: '/images/blog/react-guide.jpg',
    // ...
  }
];

// src/features/projects/services/projectService.ts
const MOCK_PROJECTS: Project[] = [
  {
    coverImage: '/images/projects/ecommerce-cover.jpg',
    images: [
      '/images/projects/ecommerce-screenshot-1.jpg',
      '/images/projects/ecommerce-screenshot-2.jpg',
    ],
    // ...
  }
];
```

## 📏 Recommended Image Sizes

- **Profile Photo**: 800x800px (square)
- **Hero Background**: 1920x1080px (16:9)
- **Project Covers**: 1200x675px (16:9)
- **Blog Covers**: 1200x630px (OG image ratio)
- **Tech Icons**: SVG (scalable) or 200x200px PNG
- **Company Logos**: 200x200px PNG (transparent)

## 🗜️ Optimize Your Images

Before adding images:
1. Compress with TinyPNG: https://tinypng.com/
2. Target < 200KB per image
3. Use WebP format for better compression
4. Use SVG for icons/logos when possible

## ✅ Quick Start

1. Add your images to the appropriate folders
2. Update the paths in your mock data files
3. Refresh your browser to see the images

That's it! 🎨
