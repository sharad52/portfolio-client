import { ApiService } from '@/core/api/apiClient';
import { PaginatedResponse, PaginationParams } from '@/shared/types/common';
import { BlogPost, BlogFilters, BlogComment } from '../types';
import { MOCK_POSTS } from './posts.data';

export class BlogService {
  private static readonly BASE_PATH = '/blog';

  // Get all blog posts with pagination and filters
  static async getPosts(
    params?: PaginationParams & BlogFilters
  ): Promise<PaginatedResponse<BlogPost>> {
    // TODO: Replace with real API call when backend is ready
    // return ApiService.get<PaginatedResponse<BlogPost>>(`${this.BASE_PATH}/posts`, { params });
    
    // Mock implementation — resolves synchronously (no artificial latency).
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

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paginated = filteredPosts.slice(start, start + limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit),
      },
    };
  }

  // Get a single blog post by slug
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // TODO: Replace with real API call
    // return ApiService.get<BlogPost>(`${this.BASE_PATH}/posts/${slug}`);
    
    // Mock implementation — resolves synchronously (no artificial latency).
    return MOCK_POSTS.find(p => p.slug === slug) || null;
  }

  // Get featured posts
  static async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    // TODO: Replace with real API call
    // return ApiService.get<BlogPost[]>(`${this.BASE_PATH}/posts/featured`, { params: { limit } });
    
    // Mock implementation — resolves synchronously (no artificial latency).
    return MOCK_POSTS.slice(0, limit);
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
  static async getComments(_postId: string): Promise<BlogComment[]> {
    // TODO: Replace with real API call
    // return ApiService.get<BlogComment[]>(`${this.BASE_PATH}/posts/${postId}/comments`);
    
    // Mock implementation — resolves synchronously (no artificial latency).
    return [];
  }

  // Add a comment to a post
  static async addComment(
    postId: string,
    data: { author: string; email: string; content: string; parentId?: string }
  ): Promise<BlogComment> {
    return ApiService.post<BlogComment>(`${this.BASE_PATH}/posts/${postId}/comments`, data);
  }
}
