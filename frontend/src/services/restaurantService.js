import { API_BASE_URL } from '../config'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const restaurantService = {
  // GET /api/restaurant
  async getRestaurant() {
    const response = await fetch(`${API_BASE_URL}/api/restaurant`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // POST /api/restaurant
  async createRestaurant(restaurantData) {
    const response = await fetch(`${API_BASE_URL}/api/restaurant`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(restaurantData),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // PUT /api/restaurant
  async updateRestaurant(restaurantData) {
    const response = await fetch(`${API_BASE_URL}/api/restaurant`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(restaurantData),
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },

  // POST /api/restaurant/logo (Multipart Form Data)
  async uploadRestaurantLogo(logoFile) {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('logo', logoFile)

    const response = await fetch(`${API_BASE_URL}/api/restaurant/logo`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
    const data = await response.json()
    return { ok: response.ok, status: response.status, data }
  },
}
