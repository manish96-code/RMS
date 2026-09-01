import { apiClient } from './apiClient'

export const settingsService = {
  // GET /api/settings
  async getSettings() {
    return apiClient.get('/settings')
  },

  // PUT /api/settings
  async updateSettings(settingsData) {
    return apiClient.put('/settings', settingsData)
  },

  // GET /api/profile
  async getProfile() {
    return apiClient.get('/profile')
  },

  // PUT /api/profile
  async updateProfile(profileData) {
    return apiClient.put('/profile', profileData)
  },

  // PUT /api/change-password
  async changePassword(passwordData) {
    return apiClient.put('/change-password', passwordData)
  },
}
