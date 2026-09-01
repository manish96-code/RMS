import { API_BASE_URL } from '../config'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const reportService = {
  // GET /api/reports/sales?from=YYYY-MM-DD&to=YYYY-MM-DD
  async getSalesReport({ from = '', to = '' } = {}) {
    const params = new URLSearchParams()
    if (from) params.append('from', from)
    if (to) params.append('to', to)

    const queryString = params.toString() ? `?${params.toString()}` : ''
    const response = await fetch(`${API_BASE_URL}/api/reports/sales${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },
}
