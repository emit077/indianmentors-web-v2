import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { debounce, throttle } from 'lodash';
import type { DebouncedFunc } from 'lodash';
import { ref, watch, type Ref, type WatchSource } from 'vue';
import { useAuthStore } from '@/stores/auth';
import MESSAGES from '@/utils/messages';

// Axios Instance Configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor - Add Auth Token and Custom Headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const authStore = useAuthStore();
      const user = authStore.getUser();
      // Get token from user object
      const token = user?.token || user?.access_token || localStorage.getItem('access_token');

      if (token && config.headers) {
        config.headers.Authorization = `Token ${token}`;
      } else if (import.meta.env.DEV) {
        // Debug: Log when token is missing (only in development)
        console.warn('⚠️ No authentication token found for request:', config.url);
        if (user) {
          console.log('User object (no token):', user);
        } else {
          console.log('No user found in auth store');
        }
      }

      // Merge custom headers if provided
      const extendedConfig = config as ExtendedInternalAxiosRequestConfig;
      if (extendedConfig.customHeaders && config.headers) {
        Object.assign(config.headers, extendedConfig.customHeaders);
      }

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle Common Errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    handleCommonError(error);
    return Promise.reject(error);
  }
);

/** Handle common errors globally */
function handleCommonError(error: AxiosError): void {
  const config = error.config as ExtendedInternalAxiosRequestConfig | undefined;
  if (config?.skipDefaultErrorHandling) {
    return;
  }
  if (!error.response) {
    console.error('Network Error:', error.message);
    return;
  }
  const { status } = error.response;
  // Handle authentication errors
  if (status === 401 || status === 403) {
    // TODO: Handle authentication errors
    // Logout user
  }
  // Handle server errors
  else if (status >= 500) {
    console.error('Server Error:', error.response.data);
  }
  // Handle validation errors
  else if (status === 400) {
    console.error('Validation Error:', error.response.data);
  }
}

/**  Extended request config with custom options **/
export interface ApiRequestConfig extends AxiosRequestConfig {
  skipDefaultErrorHandling?: boolean;
  skipDefaultSuccessHandling?: boolean;
  showSuccessMessage?: boolean | string;
  showErrorMessage?: boolean | string;
  returnResponse?: boolean;
  /** Custom headers to add to the request (will be merged with existing headers) **/
  customHeaders?: Record<string, string>;
}

/** Extended internal request config for interceptors **/
interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipDefaultErrorHandling?: boolean;
  customHeaders?: Record<string, string>;
}

/** API Response wrapper **/
export interface ApiResponse<T = any> {
  result: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

/** Main API Helper Class **/
class ApiHelper {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  /** GET request - returns full AxiosResponse if returnResponse is true, otherwise returns data **/
  async get<T = any>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>> | T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return this.handleSuccess(response, config);
  }

  /** POST request - returns full AxiosResponse if returnResponse is true, otherwise returns data **/
  async post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>> | T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return this.handleSuccess(response, config);
  }

  /** PUT request - returns full AxiosResponse if returnResponse is true, otherwise returns data **/
  async put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>> | T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return this.handleSuccess(response, config);
  }

  /** PATCH request - returns full AxiosResponse if returnResponse is true, otherwise returns data **/
  async patch<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>> | T> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return this.handleSuccess(response, config);
  }

  /** DELETE request - returns full AxiosResponse if returnResponse is true, otherwise returns data **/
  async delete<T = any>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<ApiResponse<T>> | T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return this.handleSuccess(response, config);
  }

  /** Handle success response - returns full response object if returnResponse is true, otherwise returns data **/
  private handleSuccess<T>(response: AxiosResponse<ApiResponse<T>>, config?: ApiRequestConfig): AxiosResponse<ApiResponse<T>> | T {
    const { showSuccessMessage, skipDefaultSuccessHandling, returnResponse } = config || {};
    if (!skipDefaultSuccessHandling && showSuccessMessage) {
      const message = typeof showSuccessMessage === 'string' ? showSuccessMessage : response.data.message || MESSAGES.SAVE_SUCCESS;
      console.log('✅', message);
    }
    return returnResponse ? response : ((response.data?.result || response.data) as T);
  }

  /** Get raw axios instance for advanced usage **/
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

/** Debounced Search Helper **/
let searchController: AbortController | null = null;

/** Create a debounced search function **/
export function createDebouncedSearch<T = any>(
  searchFn: (query: string, signal?: AbortSignal) => Promise<T>,
  delay: number = 300
): DebouncedFunc<(query: string) => Promise<void>> {
  return debounce(async (query: string) => {
    // Cancel previous request if it exists
    if (searchController) {
      searchController.abort();
    }

    // Create new abort controller for this request
    searchController = new AbortController();

    try {
      await searchFn(query, searchController.signal);
    } catch (err: any) {
      // Ignore cancellation errors
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error('Search error:', err);
      }
    }
  }, delay);
}
/** Export singleton instance **/
export const api = new ApiHelper(axiosInstance);

/** Export axios instance for direct use if needed **/
export { axiosInstance };

/** Export types **/
export type { AxiosError, AxiosResponse, AxiosRequestConfig };
