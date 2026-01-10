export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
}

export interface ContactSubmission extends ContactFormData {
  id: string;
  submittedAt: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  ipAddress?: string;
}
