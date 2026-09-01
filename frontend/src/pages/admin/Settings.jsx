import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../components/AdminSidebar'
import { settingsService } from '../../services/settingsService'
import { restaurantService } from '../../services/restaurantService'

const Settings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst_number: '',
    opening_time: '09:00',
    closing_time: '23:00',
    tax_enabled: true,
    tax_percentage: 5.00,
  })

  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [errors, setErrors] = useState({})

  // Fetch Settings Data
  const fetchSettings = async () => {
    setLoading(true)
    const res = await settingsService.getSettings()
    if (res.ok && res.data?.success) {
      const rest = res.data.data?.restaurant || {}
      const tax = res.data.data?.tax || {}

      setFormData({
        name: rest.name || '',
        email: rest.email || '',
        phone: rest.phone || '',
        address: rest.address || '',
        city: rest.city || '',
        state: rest.state || '',
        pincode: rest.pincode || '',
        gst_number: rest.gst_number || '',
        opening_time: rest.opening_time || '09:00',
        closing_time: rest.closing_time || '23:00',
        tax_enabled: tax.enabled !== undefined ? tax.enabled : true,
        tax_percentage: tax.percentage !== undefined ? tax.percentage : 5.00,
      })

      if (rest.logo_url) {
        setLogoPreview(rest.logo_url)
      }
    } else {
      toast.error(res.data?.message || 'Failed to load restaurant settings.')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  // Handle Logo Upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleUploadLogoSubmit = async () => {
    if (!logoFile) return
    setUploadingLogo(true)
    const res = await restaurantService.uploadLogo(logoFile)
    if (res.ok && res.data?.success) {
      toast.success('Restaurant logo uploaded successfully!')
      setLogoFile(null)
      fetchSettings()
    } else {
      toast.error(res.data?.message || 'Failed to upload logo.')
    }
    setUploadingLogo(false)
  }

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    const payload = {
      ...formData,
      tax_enabled: Boolean(formData.tax_enabled),
      tax_percentage: Number(formData.tax_percentage),
    }

    const res = await settingsService.updateSettings(payload)
    if (res.ok && res.data?.success) {
      toast.success('Restaurant settings & tax configuration saved successfully!')
      fetchSettings()
    } else {
      if (res.data?.errors) {
        setErrors(res.data.errors)
      }
      toast.error(res.data?.message || 'Failed to save settings.')
    }
    setSaving(false)
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      <AdminSidebar />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              System Configuration
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
              <span>⚙️</span> Restaurant Settings
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage restaurant identity, logo, operating hours & tax calculation rules
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSettings}
              disabled={loading || saving}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer disabled:opacity-50"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
            <div className="inline-block animate-spin w-8 h-8 border-3 border-slate-800 border-t-transparent rounded-full"></div>
            <p className="text-xs font-bold text-slate-700">Loading Restaurant Settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Restaurant Profile Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>🏪</span> Restaurant Identity & Contact Information
                </h3>
                <p className="text-xs text-slate-500">Business details displayed on invoices & receipts</p>
              </div>

              {/* Logo Section */}
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🍽️</span>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <span className="text-xs font-bold text-slate-800 block">Restaurant Logo</span>
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                    />
                    {logoFile && (
                      <button
                        type="button"
                        onClick={handleUploadLogoSubmit}
                        disabled={uploadingLogo}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition disabled:opacity-50 cursor-pointer"
                      >
                        {uploadingLogo ? 'Uploading...' : 'Save New Logo 📤'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                {/* Restaurant Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Restaurant Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Gourmet Haven Restaurant"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900 font-semibold"
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 font-bold">{errors.name[0]}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Contact Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Business Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@restaurant.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                  />
                </div>

                {/* GST Number */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">GSTIN Tax Registration Number</label>
                  <input
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900 font-mono"
                  />
                </div>

                {/* Address Full Width */}
                <div className="md:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Shop #12, Food Court Arcade"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                  />
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New Delhi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                  />
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Delhi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                  />
                </div>

                {/* Pincode */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="110001"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900 font-mono"
                  />
                </div>

                {/* Operating Hours */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Opening Time</label>
                    <input
                      type="time"
                      name="opening_time"
                      value={formData.opening_time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Closing Time</label>
                    <input
                      type="time"
                      name="closing_time"
                      value={formData.closing_time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Tax Configuration Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>💸</span> Automatic Tax Rules & Configuration
                </h3>
                <p className="text-xs text-slate-500">
                  Tax settings applied dynamically when staff places customer orders
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                <span className="font-extrabold block">ℹ️ Financial Integrity Protection:</span>
                <p>
                  Modifying tax rules affects new incoming orders only. Existing historical orders and past customer receipts will remain unchanged.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Tax Toggle */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-slate-900 block text-sm">Enable GST / Order Tax</span>
                      <span className="text-slate-500 font-medium">Apply tax on customer order subtotal</span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="tax_enabled"
                        checked={formData.tax_enabled}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="pt-2 text-slate-600 font-semibold border-t border-slate-200">
                    Status: {formData.tax_enabled ? '🟢 Tax Active' : '⏸️ Tax Disabled (0%)'}
                  </div>
                </div>

                {/* Tax Percentage */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div>
                    <label className="font-extrabold text-slate-900 block text-sm">Tax Percentage (%)</label>
                    <span className="text-slate-500 font-medium">Standard rate applied to subtotal</span>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      name="tax_percentage"
                      value={formData.tax_percentage}
                      onChange={handleChange}
                      disabled={!formData.tax_enabled}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900 font-extrabold text-base disabled:opacity-50"
                    />
                    <span className="absolute right-4 top-2.5 text-slate-400 font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Buttons Bar */}
            <div className="flex items-center justify-end gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving Settings...' : 'Save All Settings 💾'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

export default Settings
