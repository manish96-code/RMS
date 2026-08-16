import React, { useState } from 'react'
import { API_BASE_URL } from '../../config'

const Create = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    course: '',
    gender: ''
  })

  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
      }

      const response = await fetch(`${API_BASE_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        setStatus({ type: 'success', message: data.message || 'Student registered successfully!' })
        setFormData({ name: '', email: '', contact: '', course: '', gender: '' })
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to save student.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Unable to connect to the server.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({ name: '', email: '', contact: '', course: '', gender: '' })
    setStatus({ type: '', message: '' })
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      {/* Form Header */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800">Add New Student</h2>
        <p className="text-sm text-slate-500 mt-0.5">Fill in student information below.</p>
      </div>

      {/* Alert Notification */}
      {status.message && (
        <div
          className={`mb-5 p-3.5 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
            status.type === 'error'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          <span>{status.message}</span>
        </div>
      )}

      {/* Student Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Contact Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="contact"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Contact phone number"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="course" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Course / Program
            </label>
            <input
              type="text"
              name="course"
              id="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium disabled:opacity-60 transition cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : 'Add Student'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default Create



