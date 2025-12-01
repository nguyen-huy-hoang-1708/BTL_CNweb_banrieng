import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include x-user-id header
api.interceptors.request.use((config) => {
  // Try to get user_id from localStorage (from login response)
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('user_id')
  
  if (userId) {
    config.headers['x-user-id'] = userId
  } else {
    // Fallback: use a demo user_id for testing (first user from DB)
    // TODO: Remove this after implementing proper authentication
    config.headers['x-user-id'] = '9593c2a8-b6e0-11f0-a52f-a994e7cc46f9'
  }
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  
  return config
})

export default api
