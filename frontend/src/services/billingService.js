import { API_BASE_URL } from '../config'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const billingService = {
  // GET /api/orders/{id}/bill
  async getBill(orderId) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/bill`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // POST /api/orders/{id}/payment
  async completePayment(orderId, paymentMethod) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ payment_method: paymentMethod }),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // GET /api/orders/{id}/payment
  async getPayment(orderId) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // GET /api/orders/{id}/receipt
  async getReceipt(orderId) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/receipt`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },
}
