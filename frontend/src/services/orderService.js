import { API_BASE_URL } from '../config'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const orderService = {
  // GET /api/orders
  async getOrders(filters = {}) {
    const queryParams = new URLSearchParams()
    if (filters.status) queryParams.append('status', filters.status)
    if (filters.table_id) queryParams.append('table_id', filters.table_id)
    if (filters.staff_id) queryParams.append('staff_id', filters.staff_id)
    if (filters.date) queryParams.append('date', filters.date)
    if (filters.search) queryParams.append('search', filters.search)

    const url = `${API_BASE_URL}/api/orders?${queryParams.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // GET /api/orders/{id}
  async getOrder(id) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // POST /api/orders
  async createOrder(orderPayload) {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderPayload),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PATCH /api/orders/{id}/status
  async updateOrderStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // POST /api/orders/{id}/cancel
  async cancelOrder(id) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },
}
