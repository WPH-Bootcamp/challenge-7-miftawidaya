import api from './axios';
import { API_ENDPOINTS } from '@/config/api';
import { ApiResponse } from '@/types/common';
import { AuthData, LoginInput, RegisterInput, User } from '@/types/auth';

/**
 * Authentication API Service
 */
export const authService = {
  /**
   * Login user
   */
  login: async (data: LoginInput): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterInput): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.PROFILE
    );
    return response.data;
  },

  /**
   * Update user profile
   * @note Uses multipart/form-data for avatar upload
   */
  updateProfile: async (data: FormData): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.PROFILE,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
