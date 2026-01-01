import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { debounce, throttle } from 'lodash';
import type { DebouncedFunc } from 'lodash';
import { ref, watch, type Ref, type WatchSource } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { router } from '@/router';
import MESSAGES from '@/utils/messages';

// ============================================================================
// Axios Instance Configuration
// ============================================================================

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// Request Interceptor - Add Auth Token
// ============================================================================

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const authStore = useAuthStore();
      const user = authStore.getUser();

      // Check for token in multiple possible fields
      // Regular login uses 'token', Google login uses 'access_token'
      const token = "ee976efdff9c9713fa009b892920decb588ae23d"//user?.token || user?.access_token;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (import.meta.env.DEV) {
        // Debug: Log when token is missing (only in development)
        console.warn('⚠️ No authentication token found for request:', config.url);
        if (user) {
          console.log('User object (no token):', user);
        } else {
          console.log('No user found in auth store');
        }
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

// ============================================================================
// Response Interceptor - Handle Common Errors
// ============================================================================

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    handleCommonError(error);
    return Promise.reject(error);
  }
);

/**
 * Handle common errors globally
 */
function handleCommonError(error: AxiosError): void {
  const config = error.config as ExtendedInternalAxiosRequestConfig | undefined;
  if (config?.skipDefaultErrorHandling) {
    return;
  }

  const authStore = useAuthStore();

  if (!error.response) {
    console.error('Network Error:', error.message);
    return;
  }

  const { status } = error.response;

  // Handle authentication errors
  if (status === 401 || status === 403) {
    const user = authStore.getUser();
    if (user) {
      authStore.logout();
    }
  }

  // Handle server errors
  if (status >= 500) {
    console.error('Server Error:', error.response.data);
  }

  // Handle validation errors
  if (status === 400) {
    console.error('Validation Error:', error.response.data);
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Extended request config with custom options
 */
export interface ApiRequestConfig extends AxiosRequestConfig {
  skipDefaultErrorHandling?: boolean;
  skipDefaultSuccessHandling?: boolean;
  showSuccessMessage?: boolean | string;
  showErrorMessage?: boolean | string;
}

/**
 * Extended internal request config for interceptors
 */
interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipDefaultErrorHandling?: boolean;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  result: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

/**
 * Debounced search options
 */
export interface DebouncedSearchOptions {
  debounceMs?: number;
  minLength?: number;
  immediate?: boolean;
  maxWait?: number;
}

/**
 * Throttled search options
 */
export interface ThrottledSearchOptions {
  throttleMs?: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Search state for composables
 */
export interface SearchState<T> {
  query: Ref<string>;
  results: Ref<T[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
}

// ============================================================================
// Main API Helper Class
// ============================================================================

class ApiHelper {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return this.handleSuccess(response, config);
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return this.handleSuccess(response, config);
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return this.handleSuccess(response, config);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return this.handleSuccess(response, config);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: ApiRequestConfig): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return this.handleSuccess(response, config);
  }

  /**
   * Handle success response
   */
  private handleSuccess<T>(response: AxiosResponse<ApiResponse<T>>, config?: ApiRequestConfig): T {
    const { skipDefaultSuccessHandling, showSuccessMessage } = config || {};
    const responseData = response.data;

    // Extract data from response - handle both ApiResponse wrapper and direct data
    let data: T;
    if (responseData && typeof responseData === 'object' && 'result' in responseData) {
      // Wrapped response (ApiResponse)
      data = (responseData as ApiResponse<T>).result;
    } else {
      // Direct data
      data = responseData as T;
    }

    // Show success message if requested
    if (!skipDefaultSuccessHandling && showSuccessMessage) {
      const message = typeof showSuccessMessage === 'string'
        ? showSuccessMessage
        : (responseData as ApiResponse<T>).message || MESSAGES.SAVE_SUCCESS;

      console.log('Success:', message);
    }

    return data;
  }

  /**
   * Create a debounced search function
   * Best for: Search inputs where you want to wait until user stops typing
   */
  createDebouncedSearch<T = any>(
    url: string,
    options: DebouncedSearchOptions = {},
    apiConfig?: ApiRequestConfig
  ): DebouncedFunc<(query: string, params?: Record<string, any>) => Promise<T>> {
    const { debounceMs = 300, minLength = 2 } = options;

    const searchFn = async (query: string, additionalParams?: Record<string, any>): Promise<T> => {
      if (query.length < minLength) {
        return [] as unknown as T;
      }

      const searchParams = new URLSearchParams();
      if (query) {
        searchParams.append('search', query);
      }

      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
      }

      const queryString = searchParams.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      return this.get<T>(fullUrl, apiConfig);
    };

    return debounce(searchFn, debounceMs, {
      leading: options.immediate,
      maxWait: options.maxWait,
    });
  }

  /**
   * Create a throttled search function
   * Best for: Continuous updates where you want to limit frequency
   */
  createThrottledSearch<T = any>(
    url: string,
    options: ThrottledSearchOptions = {},
    apiConfig?: ApiRequestConfig
  ): DebouncedFunc<(query: string, params?: Record<string, any>) => Promise<T>> {
    const { throttleMs = 1000, leading = true, trailing = true } = options;

    const searchFn = async (query: string, additionalParams?: Record<string, any>): Promise<T> => {
      const searchParams = new URLSearchParams();
      if (query) {
        searchParams.append('search', query);
      }

      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
      }

      const queryString = searchParams.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      return this.get<T>(fullUrl, apiConfig);
    };

    return throttle(searchFn, throttleMs, { leading, trailing });
  }

  /**
   * Get raw axios instance for advanced usage
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// ============================================================================
// Vue Composables
// ============================================================================

/**
 * Vue composable for debounced search with automatic state management
 * Best for: Vue components - handles loading, error, and results automatically
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useDebouncedSearch } from '@/utils/api/axios';
 * import URLS from '@/utils/urls';
 * 
 * const search = useDebouncedSearch(URLS.STUDENT_LIST, {
 *   debounceMs: 300,
 *   minLength: 2
 * });
 * </script>
 * 
 * <template>
 *   <v-text-field v-model="search.query.value" :loading="search.loading.value" />
 *   <div v-for="item in search.results.value" :key="item.id">{{ item.name }}</div>
 * </template>
 * ```
 */
export function useDebouncedSearch<T = any>(
  url: string,
  options: DebouncedSearchOptions & { initialQuery?: string } = {}
): SearchState<T> & {
  search: (query?: string, params?: Record<string, any>) => Promise<T[]>;
  cancel: () => void;
  reset: () => void;
} {
  const { debounceMs = 300, minLength = 2, initialQuery = '' } = options;

  const query = ref(initialQuery);
  const results = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const abortController = ref<AbortController | null>(null);

  const performSearch = debounce(async (searchQuery: string, params?: Record<string, any>) => {
    if (searchQuery.length < minLength) {
      results.value = [];
      loading.value = false;
      return;
    }

    // Cancel previous request
    if (abortController.value) {
      abortController.value.abort();
    }

    abortController.value = new AbortController();
    loading.value = true;
    error.value = null;

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('search', searchQuery);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
      }

      const queryString = searchParams.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const result = await api.get<T[]>(fullUrl, {
        signal: abortController.value.signal,
        skipDefaultErrorHandling: true,
      });

      results.value = result;
    } catch (err: any) {
      if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
        error.value = err;
        results.value = [];
      }
    } finally {
      loading.value = false;
    }
  }, debounceMs);

  // Auto-search when query changes
  watch(query, (newQuery) => {
    performSearch(newQuery);
  });

  const search = async (searchQuery?: string, params?: Record<string, any>): Promise<T[]> => {
    const queryToSearch = searchQuery ?? query.value;
    query.value = queryToSearch;
    await performSearch(queryToSearch, params);
    return results.value;
  };

  const cancel = () => {
    if (abortController.value) {
      abortController.value.abort();
      abortController.value = null;
    }
    performSearch.cancel();
  };

  const reset = () => {
    cancel();
    query.value = '';
    results.value = [];
    error.value = null;
    loading.value = false;
  };

  return {
    query,
    results,
    loading,
    error,
    search,
    cancel,
    reset,
  };
}

/**
 * Vue composable for throttled search
 * Best for: Scenarios where you want to limit API calls but execute more frequently than debounce
 */
export function useThrottledSearch<T = any>(
  url: string,
  options: ThrottledSearchOptions & { initialQuery?: string } = {}
): SearchState<T> & {
  search: (query?: string, params?: Record<string, any>) => Promise<T[]>;
  cancel: () => void;
} {
  const { throttleMs = 1000, leading = true, trailing = true, initialQuery = '' } = options;

  const query = ref(initialQuery);
  const results = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const performSearch = throttle(async (searchQuery: string, params?: Record<string, any>) => {
    loading.value = true;
    error.value = null;

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('search', searchQuery);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
      }

      const queryString = searchParams.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const result = await api.get<T[]>(fullUrl, {
        skipDefaultErrorHandling: true,
      });

      results.value = result;
    } catch (err: any) {
      error.value = err;
      results.value = [];
    } finally {
      loading.value = false;
    }
  }, throttleMs, { leading, trailing });

  watch(query, (newQuery) => {
    if (newQuery) {
      performSearch(newQuery);
    }
  });

  const search = async (searchQuery?: string, params?: Record<string, any>): Promise<T[]> => {
    const queryToSearch = searchQuery ?? query.value;
    query.value = queryToSearch;
    await performSearch(queryToSearch, params);
    return results.value;
  };

  const cancel = () => {
    performSearch.cancel();
  };

  return {
    query,
    results,
    loading,
    error,
    search,
    cancel,
  };
}

/**
 * Handle concurrent requests - only keep the latest request result
 * Best for: Preventing race conditions when multiple requests are in flight
 */
export function useConcurrentRequestHandler<T>() {
  let requestId = 0;

  return async (request: () => Promise<T>): Promise<T> => {
    const currentRequestId = ++requestId;

    try {
      const result = await request();

      if (currentRequestId === requestId) {
        return result;
      }

      throw new Error('Request superseded by newer request');
    } catch (error) {
      if (currentRequestId !== requestId) {
        throw new Error('Request superseded');
      }
      throw error;
    }
  };
}

// ============================================================================
// Exports
// ============================================================================

// Export singleton instance
export const api = new ApiHelper(axiosInstance);

// Export axios instance for direct use if needed
export { axiosInstance };

// Export types
export type { AxiosError, AxiosResponse, AxiosRequestConfig };
