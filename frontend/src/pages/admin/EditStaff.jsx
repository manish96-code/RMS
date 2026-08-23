import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const EditStaff = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Waiter',
    shift: 'Morning',
    status: 'On Duty',
    is_active: true,
  })

  const [loading, setLoading] = useState(true)
  const [fieldErrors, setFieldErrors] = useState({})
  const [alertStatus, setAlertStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/staff/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Staff member not found')
        return res.json()
      })
      .then((data) => {
        const staff = data.staff || data.data || data
        if (staff) {
          setFormData({
            name: staff.name || '',
            email: staff.email || '',
            phone: staff.phone || '',
            role: staff.role || 'Waiter',
            shift: staff.shift || 'Morning',
            status: staff.status || 'On Duty',
            is_active: staff.is_active !== undefined ? staff.is_active : true,
          })
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading staff details:', err)
        setAlertStatus({ type: 'error', message: 'Failed to load staff details.' })
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlertStatus({ type: '', message: '' })
    setFieldErrors({})

    try {
      const response = await fetch(`${API_BASE_URL}/api/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setAlertStatus({
          type: 'success',
          message: data.message || `Staff member "${formData.name}" updated successfully!`,
        })
        setTimeout(() => {
          navigate('/admin/staff')
        }, 1500)
      } else {
        if (data.errors) {
          const parsedErrors = {}
          Object.keys(data.errors).forEach((key) => {
            parsedErrors[key] = data.errors[key][0]
          })
          setFieldErrors(parsedErrors)
        } else {
          setAlertStatus({
            type: 'error',
            message: data.message || 'Failed to update staff member details.',
          })
        }
      }
    } catch {
      setAlertStatus({
        type: 'error',
        message: 'Unable to connect to backend server.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased text-left font-sans">
      <AdminSidebar />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Staff Member</h1>
            <p className="text-xs text-slate-500 mt-0.5">Update staff details for User ID: #{id}</p>
          </div>

          <Link
            to="/admin/staff"
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg transition"
          >
            ← Back to Roster
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading staff details...</p>
          </div>
        ) : (
          <>
            {/* Status Alert */}
            {alertStatus.message && (
              <div
                className={`p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
                  alertStatus.type === 'error'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                <span>{alertStatus.message}</span>
              </div>
            )}

            {/* Edit Form Card */}
            <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
              <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs font-medium">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Kumar"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-xs focus:outline-none transition ${
                      fieldErrors.name
                        ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800'
                    }`}
                  />
                  {fieldErrors.name && (
                    <span className="text-rose-600 text-[11px] font-semibold mt-1 block flex items-center gap-1">
                      ⚠️ {fieldErrors.name}
                    </span>
                  )}
                </div>

                {/* Email & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rajesh@gourmethaven.com"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs focus:outline-none transition ${
                        fieldErrors.email
                          ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800'
                      }`}
                    />
                    {fieldErrors.email && (
                      <span className="text-rose-600 text-[11px] font-semibold mt-1 block flex items-center gap-1">
                        ⚠️ {fieldErrors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs focus:outline-none transition ${
                        fieldErrors.phone
                          ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <span className="text-rose-600 text-[11px] font-semibold mt-1 block flex items-center gap-1">
                        ⚠️ {fieldErrors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Role, Shift & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="role" className="block font-semibold text-slate-700 mb-1">
                      Staff Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                    >
                      <option value="Head Chef">Head Chef</option>
                      <option value="Chef">Chef / Line Cook</option>
                      <option value="Senior Waiter">Senior Waiter</option>
                      <option value="Waiter">Waiter</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Floor Supervisor">Floor Supervisor</option>
                      <option value="Manager">Restaurant Manager</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="shift" className="block font-semibold text-slate-700 mb-1">
                      Work Shift
                    </label>
                    <select
                      id="shift"
                      name="shift"
                      value={formData.shift}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                    >
                      <option value="Morning">Morning Shift (08:00 AM - 04:00 PM)</option>
                      <option value="Evening">Evening Shift (04:00 PM - 12:00 AM)</option>
                      <option value="Night">Night Shift (12:00 AM - 08:00 AM)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block font-semibold text-slate-700 mb-1">
                      Duty Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                    >
                      <option value="On Duty">On Duty</option>
                      <option value="Off Duty">Off Duty</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                {/* Account Active Checkbox */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-800"
                  />
                  <label htmlFor="is_active" className="text-xs font-semibold text-slate-700 select-none cursor-pointer">
                    Account Enabled (is_active = {formData.is_active ? 'True 🟢' : 'False 🔴'})
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? 'Saving Changes...' : 'Update Staff Member'}
                  </button>
                  <Link
                    to="/admin/staff"
                    className="py-2.5 px-4 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold text-xs rounded-lg transition"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default EditStaff
