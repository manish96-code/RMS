import { API_BASE_URL } from '../config'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const menuItemService = {
  // GET /api/menu-items?category_id=...&is_available=...&search=...
  async getMenuItems(filters = {}) {
    const queryParams = new URLSearchParams()
    if (filters.category_id) queryParams.append('category_id', filters.category_id)
    if (filters.is_available !== undefined && filters.is_available !== '') {
      queryParams.append('is_available', filters.is_available)
    }
    if (filters.search) queryParams.append('search', filters.search)

    const url = `${API_BASE_URL}/api/menu-items?${queryParams.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // GET /api/menu-items/{id}
  async getMenuItem(id) {
    const response = await fetch(`${API_BASE_URL}/api/menu-items/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // POST /api/menu-items (Multipart Form Data for optional image upload)
  async createMenuItem(formDataPayload) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/api/menu-items`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formDataPayload,
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PUT /api/menu-items/{id}
  async updateMenuItem(id, formDataPayload) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/api/menu-items/${id}`, {
      method: 'POST', // Use POST with multipart and _method=PUT or fetch body
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formDataPayload,
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // DELETE /api/menu-items/{id}
  async deleteMenuItem(id) {
    const response = await fetch(`${API_BASE_URL}/api/menu-items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PATCH /api/menu-items/{id}/availability
  async updateAvailability(id, is_available) {
    const response = await fetch(`${API_BASE_URL}/api/menu-items/${id}/availability`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_available }),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },
}
