import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

/**
 * Axios Instance Configuration
 * @description Standardized axios client with base URL and interceptors.
 * Now uses Cookies for token storage to support Next.js SSR/Middleware compatibility.
 */
const api: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Request Interceptor
 * @description Injects authorization token into headers if available.
 * Using Cookies instead of localStorage for SSR compatibility.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * @description Centralized error handling for API responses.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      if (globalThis.window !== undefined) {
        Cookies.remove('auth_token');
        // We can't use redirect() here as it's not a server context,
        // and we shouldn't force a reload unless necessary.
        // Usually handled by the auth provider or middleware.
      }
    }

    // Standardize error message
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    // We attach the message to the error object for easy access in components
    const customError = {
      ...error,
      message,
    };

    return Promise.reject(customError);
  }
);

export default api;
