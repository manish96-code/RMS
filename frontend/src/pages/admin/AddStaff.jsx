import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const AddStaff = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Waiter',
    shift: 'Morning',
    status: 'On Duty',
  })

  const [alertStatus, setAlertStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAlertStatus({ type: '', message: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setAlertStatus({
          type: 'success',
          message: data.message || `Staff member "${formData.name}" registered successfully!`,
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: 'Waiter',
          shift: 'Morning',
          status: 'On Duty',
        })
        setTimeout(() => {
          navigate('/admin/staff')
        }, 1500)
      } else {
        setAlertStatus({
          type: 'error',
          message: data.message || 'Failed to register staff member.',
        })
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
      
      {/* Shared Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New Staff Member</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Register kitchen chefs, waiters, cashiers or floor managers
            </p>
          </div>

          <Link
            to="/admin/staff"
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg transition"
          >
            ← View Staff Roster
          </Link>
        </div>

        {/* Status Notification */}
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

        {/* Add Staff Form Card */}
        <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
              />
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
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rajesh@gourmethaven.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                />
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

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? 'Registering Staff...' : 'Register Staff Member'}
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

      </main>

    </div>
  )
}

export default AddStaff
