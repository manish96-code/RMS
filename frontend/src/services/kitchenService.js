import { API_BASE_URL } from '../config'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const kitchenService = {
  // GET /api/kitchen/orders
  async getKitchenOrders() {
    const response = await fetch(`${API_BASE_URL}/api/kitchen/orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PATCH /api/kitchen/orders/{id}/preparing
  async markOrderPreparing(id) {
    const response = await fetch(`${API_BASE_URL}/api/kitchen/orders/${id}/preparing`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PATCH /api/kitchen/orders/{id}/ready
  async markOrderReady(id) {
    const response = await fetch(`${API_BASE_URL}/api/kitchen/orders/${id}/ready`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PATCH /api/orders/{id}/status (ready -> served)
  async markOrderServed(id) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: 'served' }),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },
}
