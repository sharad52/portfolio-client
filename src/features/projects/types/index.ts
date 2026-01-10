import { BaseEntity } from '@/shared/types/common';

export interface Project extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  coverImage?: string;
  images?: string[];
  technologies: Technology[];
  category: ProjectCategory;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  role?: string;
  team?: TeamMember[];
  highlights?: string[];
}

export interface Technology {
  id: string;
  name: string;
  icon?: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
}

export type ProjectStatus = 'planned' | 'in-progress' | 'completed' | 'archived';

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  url?: string;
}

export interface ProjectFilters {
  category?: string;
  technology?: string;
  status?: ProjectStatus;
  featured?: boolean;
}
