import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../../components/AdminSidebar'
import RestaurantForm from '../../../components/restaurant/RestaurantForm'
import RestaurantLogo from '../../../components/restaurant/RestaurantLogo'
import { restaurantService } from '../../../services/restaurantService'

const RestaurantSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst_number: '',
    opening_time: '10:00',
    closing_time: '22:00',
    status: 'active',
  })

  const [currentLogoUrl, setCurrentLogoUrl] = useState('')
  const [hasRestaurant, setHasRestaurant] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load existing restaurant data on page load
  const fetchRestaurant = async () => {
    setLoading(true)
    const { ok, data } = await restaurantService.getRestaurant()

    if (ok && data.success && data.data) {
      const rest = data.data
      setFormData({
        name: rest.name || '',
        email: rest.email || '',
        phone: rest.phone || '',
        address: rest.address || '',
        city: rest.city || '',
        state: rest.state || '',
        pincode: rest.pincode || '',
        gst_number: rest.gst_number || '',
        opening_time: rest.opening_time || '10:00',
        closing_time: rest.closing_time || '22:00',
        status: rest.status || 'active',
      })
      setCurrentLogoUrl(rest.logo_url || '')
      setHasRestaurant(true)
    } else {
      setHasRestaurant(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRestaurant()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleLogoUpdated = (updatedRestaurant) => {
    if (updatedRestaurant?.logo_url) {
      setCurrentLogoUrl(updatedRestaurant.logo_url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFieldErrors({})

    let responseData
    if (hasRestaurant) {
      responseData = await restaurantService.updateRestaurant(formData)
    } else {
      responseData = await restaurantService.createRestaurant(formData)
    }

    const { ok, data } = responseData

    if (ok && data.success) {
      toast.success(data.message || 'Restaurant profile saved successfully!')
      setHasRestaurant(true)
      if (data.data?.logo_url) {
        setCurrentLogoUrl(data.data.logo_url)
      }
    } else {
      if (data.errors) {
        const parsed = {}
        Object.keys(data.errors).forEach((key) => {
          parsed[key] = data.errors[key][0]
        })
        setFieldErrors(parsed)
      } else {
        toast.error(data.message || 'Failed to save restaurant details.')
      }
    }

    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      <AdminSidebar />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Restaurant Setup & Profile</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure outlet information, tax registration, address and logo for receipts
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl transition shadow-2xs"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading restaurant configuration...</p>
          </div>
        ) : (
          <div className="max-w-3xl space-y-6">
            
            {/* Restaurant Logo Component */}
            <RestaurantLogo
              currentLogoUrl={currentLogoUrl}
              onLogoUpdated={handleLogoUpdated}
            />

            {/* Restaurant Form Component */}
            <RestaurantForm
              formData={formData}
              fieldErrors={fieldErrors}
              onChange={handleChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />

          </div>
        )}

      </main>
    </div>
  )
}

export default RestaurantSettings
