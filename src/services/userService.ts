import api from './api'
import type { User } from '@/stores/user'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export const userService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register user
  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Get current user profile
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get('/user/profile')
    return response.data
  },

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.put('/user/profile', userData)
    return response.data
  },

  // Logout user
  async logout(): Promise<ApiResponse<null>> {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Get sample data (for demo purposes)
  async getSampleData(): Promise<ApiResponse<any[]>> {
    const response = await api.get('/posts')
    return {
      data: response.data,
      success: true,
      message: 'Sample data retrieved successfully',
    }
  },
}
