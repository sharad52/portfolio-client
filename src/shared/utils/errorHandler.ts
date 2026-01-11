import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * Global Error Handler Hook
 * Use this in your App.tsx to catch unhandled errors
 */
export const useGlobalErrorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Check if it's a network/server error
      if (event.reason?.status >= 500 || event.reason?.name === 'NetworkError') {
        navigate('/error');
      }
    };

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      // You can add logic to determine if it's a critical error
      if (event.error?.name === 'ServerError') {
        navigate('/error');
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [navigate]);
};

/**
 * API Error Class
 * Custom error class for API errors
 */
export class APIError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Fetch with Error Handling
 * Wrapper around fetch that handles errors properly
 */
export async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    // Check for HTTP errors
    if (!response.ok) {
      // 5xx errors - Server errors
      if (response.status >= 500) {
        throw new APIError(
          `Server error: ${response.statusText}`,
          response.status,
          await response.json().catch(() => null)
        );
      }

      // 4xx errors - Client errors
      if (response.status >= 400) {
        throw new APIError(
          `Client error: ${response.statusText}`,
          response.status,
          await response.json().catch(() => null)
        );
      }
    }

    return response;
  } catch (error) {
    // Network errors (no internet, CORS, etc.)
    if (error instanceof TypeError) {
      throw new APIError('Network error - please check your connection', 0);
    }

    // Re-throw APIError
    if (error instanceof APIError) {
      throw error;
    }

    // Unknown errors
    throw new APIError('An unexpected error occurred', 500);
  }
}