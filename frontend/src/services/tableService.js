import { API_BASE_URL } from '../config'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const tableService = {
  // GET /api/tables
  async getTables() {
    const response = await fetch(`${API_BASE_URL}/api/tables`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // GET /api/tables/{id}
  async getTable(id) {
    const response = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // POST /api/tables
  async createTable(tableData) {
    const response = await fetch(`${API_BASE_URL}/api/tables`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tableData),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PUT /api/tables/{id}
  async updateTable(id, tableData) {
    const response = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tableData),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // DELETE /api/tables/{id}
  async deleteTable(id) {
    const response = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PATCH /api/tables/{id}/status
  async updateTableStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/api/tables/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },
}
