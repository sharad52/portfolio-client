export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  icon?: string;
  yearsOfExperience?: number;
}

export type SkillCategory = 
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'tools'
  | 'soft-skills'
  | 'other';

export interface SkillGroup {
  category: SkillCategory;
  categoryLabel: string;
  skills: Skill[];
}
