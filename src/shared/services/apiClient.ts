import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API Client with Error Handling
 * Configured axios instance with automatic error handling
 */

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: any) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error);

    // No response - Network error
    if (!error.response) {
      console.error('Network Error: No response from server');
      // Redirect to error page for network failures
      window.location.href = '/error';
      return Promise.reject({
        message: 'Network error - please check your internet connection',
        type: 'NETWORK_ERROR',
      });
    }

    const status = error.response.status;

    // Handle different error status codes
    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        console.error('Unauthorized - Please login');
        localStorage.removeItem('authToken');
        // window.location.href = '/login';
        break;

      case 403:
        // Forbidden
        console.error('Forbidden - You don\'t have permission');
        break;

      case 404:
        // Not found
        console.error('Resource not found');
        break;

      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
        // Server errors - redirect to 500 page
        console.error('Server Error:', status);
        window.location.href = '/error';
        break;

      default:
        console.error('API Error:', status, error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * API Service Helper Functions
 */

export const api = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;