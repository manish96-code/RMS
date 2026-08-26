import { API_BASE_URL } from '../config'

/**
 * Helper to construct Authorization header
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const authService = {
  // POST /api/login
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(credentials),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // POST /api/logout
  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      return { ok: response.ok, data }
    } catch {
      return { ok: false }
    }
  },

  // GET /api/user
  async getUser() {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PUT /api/profile
  async updateProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PUT /api/change-password
  async changePassword(passwordData) {
    const response = await fetch(`${API_BASE_URL}/api/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // Staff Management APIs (Admin Only)

  // GET /api/staff
  async getStaff() {
    const response = await fetch(`${API_BASE_URL}/api/staff`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // POST /api/staff
  async createStaff(staffData) {
    const response = await fetch(`${API_BASE_URL}/api/staff`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(staffData),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // GET /api/staff/{id}
  async getSingleStaff(id) {
    const response = await fetch(`${API_BASE_URL}/api/staff/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PUT /api/staff/{id}
  async updateStaff(id, staffData) {
    const response = await fetch(`${API_BASE_URL}/api/staff/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(staffData),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // DELETE /api/staff/{id}
  async deleteStaff(id) {
    const response = await fetch(`${API_BASE_URL}/api/staff/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PUT /api/staff/{id}/toggle-status
  async toggleStaffStatus(id) {
    const response = await fetch(`${API_BASE_URL}/api/staff/${id}/toggle-status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },
}
