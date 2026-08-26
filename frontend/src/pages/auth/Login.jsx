import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setGeneralError('')

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFieldErrors({})
    setGeneralError('')

    const result = await login(formData)

    if (result.success) {
      const userRole = String(result.user?.role || '').toLowerCase()
      if (userRole === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/staff/dashboard')
      }
    } else {
      if (result.errors) {
        const parsed = {}
        Object.keys(result.errors).forEach((key) => {
          parsed[key] = result.errors[key][0]
        })
        setFieldErrors(parsed)
      } else {
        setGeneralError(result.message || 'Invalid email or password.')
      }
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased text-left font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-sm">
            🍽️
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gourmet Haven</h1>
          <p className="text-xs text-slate-500 font-medium">
            Restaurant Management System Sign In
          </p>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{generalError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs font-medium">
          
          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. admin@example.com"
              className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none transition ${
                fieldErrors.email
                  ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
              }`}
            />
            {fieldErrors.email && (
              <span className="text-rose-600 text-[11px] font-semibold mt-1.5 block">
                ⚠️ {fieldErrors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-semibold text-slate-700 mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none transition ${
                fieldErrors.password
                  ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
              }`}
            />
            {fieldErrors.password && (
              <span className="text-rose-600 text-[11px] font-semibold mt-1.5 block">
                ⚠️ {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>

        </form>

        {/* Demo Credentials Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px] text-slate-600 text-left">
          <span className="font-bold text-slate-800 block">🔑 Development Test Credentials:</span>
          <div className="flex justify-between text-slate-500">
            <span>Admin: admin@example.com</span>
            <span className="font-mono">password</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Staff: rahul@example.com</span>
            <span className="font-mono">password</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
