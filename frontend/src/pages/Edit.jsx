import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { API_BASE_URL } from '../../config'

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    course: '',
    gender: ''
  })

  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/students/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Student record not found')
        return res.json()
      })
      .then((data) => {
        const student = data.data || data.student || data
        if (student) {
          setFormData({
            name: student.name || '',
            email: student.email || '',
            contact: student.phone || student.contact || '',
            course: student.course || '',
            gender: student.gender || ''
          })
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching student details:', err)
        setStatus({ type: 'error', message: 'Failed to fetch student details.' })
        setLoading(false)
      })
  }, [id])

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

    const payload = {
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      phone: formData.contact
    }

    try {
      let response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        // Fallback to POST /api/update-student/{id}
        response = await fetch(`${API_BASE_URL}/api/update-student/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      }

      const resData = await response.json().catch(() => ({}))

      if (response.ok) {
        setStatus({ type: 'success', message: resData.message || 'Student updated successfully!' })
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        setStatus({ type: 'error', message: resData.message || 'Failed to update student.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Unable to connect to the server.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Edit Student Record</h2>
          <p className="text-sm text-slate-500 mt-0.5">Update student details below (ID: #{id})</p>
        </div>
        <Link
          to="/"
          className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
        >
          ← Back to List
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-12 text-center text-slate-500">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
          <p className="text-sm">Loading student details...</p>
        </div>
      ) : (
        <>
          {/* Notification */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
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
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
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
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
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
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
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
                {isSubmitting ? 'Updating...' : 'Update Student'}
              </button>
              <Link
                to="/"
                className="px-4 py-2.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default Edit
