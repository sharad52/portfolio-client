import { BaseEntity, SEOMeta } from '@/shared/types/common';

export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: Author;
  tags: Tag[];
  category: Category;
  published: boolean;
  publishedAt?: string;
  readingTime: number;
  views: number;
  seo?: SEOMeta;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogComment extends BaseEntity {
  postId: string;
  author: string;
  email: string;
  content: string;
  approved: boolean;
  parentId?: string;
  replies?: BlogComment[];
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
  author?: string;
  published?: boolean;
}
