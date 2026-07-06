import type { Course, Batch } from '@/content/site';

export type { Course, Batch };

/** What an enrolling visitor submits from the /tuition page. */
export interface EnrollmentFormData {
  name: string;
  email: string;
  phone: string;
  courseSlug: string;   // which course they're enrolling in
  batchId: string;      // which batch they picked
  currentLevel: string; // self-reported experience with Python
  goals?: string;       // what they want to achieve (optional)
}
