import { ApiService } from '@/core/api/apiClient';
import { PaginatedResponse, PaginationParams } from '@/shared/types/common';
import { BlogPost, BlogFilters, BlogComment } from '../types';

// Mock data for now - will be replaced with real API calls
const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    slug: 'getting-started-react-typescript',
    excerpt: 'Learn how to set up a React project with TypeScript and best practices for type-safe development.',
    content: `# Getting Started with React and TypeScript\n\nReact and TypeScript are a powerful combination...`,
    coverImage: '/images/blog/react-ts.jpg',
    author: {
      id: '1',
      name: 'Your Name',
      avatar: '/images/avatar.jpg',
    },
    tags: [
      { id: '1', name: 'React', slug: 'react' },
      { id: '2', name: 'TypeScript', slug: 'typescript' },
    ],
    category: { id: '1', name: 'Frontend', slug: 'frontend' },
    published: true,
    publishedAt: '2024-01-15T10:00:00Z',
    readingTime: 5,
    views: 1234,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

export class BlogService {
  private static readonly BASE_PATH = '/blog';

  // Get all blog posts with pagination and filters
  static async getPosts(
    params?: PaginationParams & BlogFilters
  ): Promise<PaginatedResponse<BlogPost>> {
    // TODO: Replace with real API call when backend is ready
    // return ApiService.get<PaginatedResponse<BlogPost>>(`${this.BASE_PATH}/posts`, { params });
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredPosts = MOCK_POSTS.filter(post => {
          if (params?.search) {
            const searchLower = params.search.toLowerCase();
            return (
              post.title.toLowerCase().includes(searchLower) ||
              post.excerpt.toLowerCase().includes(searchLower)
            );
          }
          if (params?.category && post.category.slug !== params.category) {
            return false;
          }
          if (params?.tag && !post.tags.some(t => t.slug === params.tag)) {
            return false;
          }
          return true;
        });

        resolve({
          data: filteredPosts,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: filteredPosts.length,
            totalPages: Math.ceil(filteredPosts.length / (params?.limit || 10)),
          },
        });
      }, 500);
    });
  }

  // Get a single blog post by slug
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // TODO: Replace with real API call
    // return ApiService.get<BlogPost>(`${this.BASE_PATH}/posts/${slug}`);
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = MOCK_POSTS.find(p => p.slug === slug);
        resolve(post || null);
      }, 500);
    });
  }

  // Get featured posts
  static async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    // TODO: Replace with real API call
    // return ApiService.get<BlogPost[]>(`${this.BASE_PATH}/posts/featured`, { params: { limit } });
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_POSTS.slice(0, limit));
      }, 500);
    });
  }

  // Create a new blog post (admin only)
  static async createPost(data: Partial<BlogPost>): Promise<BlogPost> {
    return ApiService.post<BlogPost>(`${this.BASE_PATH}/posts`, data);
  }

  // Update a blog post (admin only)
  static async updatePost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return ApiService.put<BlogPost>(`${this.BASE_PATH}/posts/${id}`, data);
  }

  // Delete a blog post (admin only)
  static async deletePost(id: string): Promise<void> {
    return ApiService.delete(`${this.BASE_PATH}/posts/${id}`);
  }

  // Get comments for a post
  static async getComments(postId: string): Promise<BlogComment[]> {
    // TODO: Replace with real API call
    // return ApiService.get<BlogComment[]>(`${this.BASE_PATH}/posts/${postId}/comments`);
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 500);
    });
  }

  // Add a comment to a post
  static async addComment(
    postId: string,
    data: { author: string; email: string; content: string; parentId?: string }
  ): Promise<BlogComment> {
    return ApiService.post<BlogComment>(`${this.BASE_PATH}/posts/${postId}/comments`, data);
  }
}
