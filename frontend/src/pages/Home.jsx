import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../config'

const Home = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/stdcall`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((resData) => {
        setData(resData)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching students:', err)
        setError('Failed to fetch students. Please check your backend connection.')
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setData((prev) => {
          if (!prev) return prev
          const list = Array.isArray(prev)
            ? prev
            : prev.students || prev.data || []
          const updated = list.filter((s) => s.id !== id)
          return Array.isArray(prev)
            ? updated
            : { ...prev, students: updated, data: updated }
        })
      } else {
        alert('Failed to delete student.')
      }
    } catch {
      alert('Unable to connect to server.')
    }
  }

  const studentList = data?.students || data?.data || (Array.isArray(data) ? data : [])

  return (
    <div className="max-w-5xl mx-auto my-6 p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            {data?.message || 'Manage and view all registered student records.'}
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 text-center text-slate-500">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
          <p className="text-sm">Loading student records...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="my-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* Table Data */}
      {!loading && !error && (
        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentList.length > 0 ? (
                studentList.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3.5 font-medium text-slate-400">#{student.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{student.name}</td>
                    <td className="px-4 py-3.5 text-slate-600">{student.email}</td>
                    <td className="px-4 py-3.5 text-slate-600">{student.phone || student.contact || '-'}</td>
                    <td className="px-4 py-3.5 text-slate-600">{student.course || '-'}</td>
                    <td className="px-4 py-3.5 text-slate-600 capitalize">{student.gender || '-'}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">
                      {student.created_at
                        ? new Date(student.created_at).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md text-xs font-medium transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-400 text-sm">
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Home

