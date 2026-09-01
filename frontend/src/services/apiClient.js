import { API_BASE_URL } from '../config'

export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || `${API_BASE_URL}/api`
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * Reusable Centralized Fetch Wrapper
 */
export const apiClient = {
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  },

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  async patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  },

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${getApiUrl()}${endpoint}`
    
    const config = {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    }

    try {
      const response = await fetch(url, config)

      // Handle 401 Unauthenticated
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }

      const data = await response.json().catch(() => ({}))

      return {
        ok: response.ok,
        status: response.status,
        data,
      }
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: {
          success: false,
          message: error.message || 'Network communication error',
        },
      }
    }
  },
}
