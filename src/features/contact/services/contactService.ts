import { ApiService } from '@/core/api/apiClient';
import { ContactFormData, ContactSubmission } from '../types';

export class ContactService {
  private static readonly BASE_PATH = '/contact';

  // Submit contact form
  static async submitForm(data: ContactFormData): Promise<ContactSubmission> {
    // TODO: Replace with real API call
    // return ApiService.post<ContactSubmission>(`${this.BASE_PATH}/submit`, data);
    
    // Mock implementation - for now just log and return success
    console.log('Contact form submitted:', data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          submittedAt: new Date().toISOString(),
          status: 'pending',
        });
      }, 1000);
    });
  }

  // Send email notification (if using email service)
  static async sendEmail(data: ContactFormData): Promise<void> {
    // This would integrate with services like SendGrid, AWS SES, etc.
    return ApiService.post(`${this.BASE_PATH}/send-email`, data);
  }

  // Get all contact submissions (admin only)
  static async getSubmissions(): Promise<ContactSubmission[]> {
    return ApiService.get<ContactSubmission[]>(`${this.BASE_PATH}/submissions`);
  }

  // Update submission status (admin only)
  static async updateStatus(
    id: string,
    status: ContactSubmission['status']
  ): Promise<ContactSubmission> {
    return ApiService.patch<ContactSubmission>(
      `${this.BASE_PATH}/submissions/${id}`,
      { status }
    );
  }
}
