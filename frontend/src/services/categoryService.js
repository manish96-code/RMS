import { API_BASE_URL } from '../config'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const categoryService = {
  // GET /api/categories
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // GET /api/categories/{id}
  async getCategory(id) {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // POST /api/categories
  async createCategory(categoryData) {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PUT /api/categories/{id}
  async updateCategory(id, categoryData) {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // DELETE /api/categories/{id}
  async deleteCategory(id) {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },
}
