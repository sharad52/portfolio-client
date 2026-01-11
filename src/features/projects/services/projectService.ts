import { ApiService } from '@/core/api/apiClient';
import { Project, ProjectFilters } from '../types';

// Mock data
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-stack e-commerce solution with real-time inventory management',
    longDescription: 'Built a comprehensive e-commerce platform featuring user authentication, product management, shopping cart functionality, and integrated payment processing.',
    coverImage: '/images/projects/project-1-cover.jpg',  // Updated to match your file
    technologies: [
      { id: '1', name: 'React', category: 'frontend' },
      { id: '2', name: 'Node.js', category: 'backend' },
      { id: '3', name: 'PostgreSQL', category: 'database' },
    ],
    category: { id: '1', name: 'Web Application', slug: 'web-app' },
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://demo-ecommerce.com',
    featured: true,
    status: 'completed',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'KharchaLog',
    slug: 'Fintech',
    description: 'AI powerd personal finance manager.',
    longDescription: 'Built a comprehensive e-commerce platform featuring user authentication, product management, shopping cart functionality, and integrated payment processing.',
    coverImage: '/images/projects/project-1-cover.jpg',  // Updated to match your file
    technologies: [
      { id: '1', name: 'React', category: 'frontend' },
      { id: '2', name: 'Node.js', category: 'backend' },
      { id: '3', name: 'PostgreSQL', category: 'database' },
    ],
    category: { id: '1', name: 'Web Application', slug: 'web-app' },
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://demo-ecommerce.com',
    featured: true,
    status: 'completed',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-stack e-commerce solution with real-time inventory management',
    longDescription: 'Built a comprehensive e-commerce platform featuring user authentication, product management, shopping cart functionality, and integrated payment processing.',
    coverImage: '/images/projects/project-1-cover.jpg',  // Updated to match your file
    technologies: [
      { id: '1', name: 'React', category: 'frontend' },
      { id: '2', name: 'Node.js', category: 'backend' },
      { id: '3', name: 'PostgreSQL', category: 'database' },
    ],
    category: { id: '1', name: 'Web Application', slug: 'web-app' },
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://demo-ecommerce.com',
    featured: true,
    status: 'completed',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-stack e-commerce solution with real-time inventory management',
    longDescription: 'Built a comprehensive e-commerce platform featuring user authentication, product management, shopping cart functionality, and integrated payment processing.',
    coverImage: '/images/projects/project-1-cover.jpg',  // Updated to match your file
    technologies: [
      { id: '1', name: 'React', category: 'frontend' },
      { id: '2', name: 'Node.js', category: 'backend' },
      { id: '3', name: 'PostgreSQL', category: 'database' },
    ],
    category: { id: '1', name: 'Web Application', slug: 'web-app' },
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://demo-ecommerce.com',
    featured: true,
    status: 'completed',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-stack e-commerce solution with real-time inventory management',
    longDescription: 'Built a comprehensive e-commerce platform featuring user authentication, product management, shopping cart functionality, and integrated payment processing.',
    coverImage: '/images/projects/project-1-cover.jpg',  // Updated to match your file
    technologies: [
      { id: '1', name: 'React', category: 'frontend' },
      { id: '2', name: 'Node.js', category: 'backend' },
      { id: '3', name: 'PostgreSQL', category: 'database' },
    ],
    category: { id: '1', name: 'Web Application', slug: 'web-app' },
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://demo-ecommerce.com',
    featured: true,
    status: 'completed',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export class ProjectService {
  private static readonly BASE_PATH = '/projects';

  static async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    // TODO: Replace with real API call
    // return ApiService.get<Project[]>(`${this.BASE_PATH}`, { params: filters });
    
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = MOCK_PROJECTS;
        if (filters?.featured !== undefined) {
          filtered = filtered.filter(p => p.featured === filters.featured);
        }
        if (filters?.status) {
          filtered = filtered.filter(p => p.status === filters.status);
        }
        resolve(filtered);
      }, 500);
    });
  }

  static async getProjectBySlug(slug: string): Promise<Project | null> {
    // TODO: Replace with real API call
    // return ApiService.get<Project>(`${this.BASE_PATH}/${slug}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = MOCK_PROJECTS.find(p => p.slug === slug);
        resolve(project || null);
      }, 500);
    });
  }

  static async createProject(data: Partial<Project>): Promise<Project> {
    return ApiService.post<Project>(`${this.BASE_PATH}`, data);
  }

  static async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return ApiService.put<Project>(`${this.BASE_PATH}/${id}`, data);
  }

  static async deleteProject(id: string): Promise<void> {
    return ApiService.delete(`${this.BASE_PATH}/${id}`);
  }
}