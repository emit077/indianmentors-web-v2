import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`)
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      console.error(`❌ API Error: ${status} - ${data?.message || 'Unknown error'}`)

      // Handle specific error cases
      switch (status) {
        case 401:
          // Unauthorized - clear user data and redirect to login
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
          break
        case 403:
          // Forbidden
          console.error('You do not have permission to access this resource')
          break
        case 404:
          // Not found
          console.error('The requested resource was not found')
          break
        case 500:
          // Server error
          console.error('Server error. Please try again later')
          break
        default:
          console.error(data?.message || 'An unexpected error occurred')
      }
    } else if (error.request) {
      // Network error
      console.error('❌ Network Error:', error.request)
      console.error('Network error. Please check your connection')
    } else {
      // Other error
      console.error('❌ Error:', error.message)
      console.error('An unexpected error occurred')
    }

    return Promise.reject(error)
  },
)

export default api
