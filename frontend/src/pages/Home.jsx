import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../config'

const Home = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStudents = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/students`)
      if (!response.ok) {
        throw new Error('Failed to fetch student records.')
      }
      const data = await response.json()
      setStudents(data.data || data || [])
    } catch {
      setError('Unable to load student list. Please check your backend connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase()
    return (
      student.name?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.phone?.toLowerCase().includes(term) ||
      student.contact?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="max-w-5xl mx-auto my-6 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view all registered student records.</p>
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

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Total Students: <span className="text-blue-600">{filteredStudents.length}</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 text-center text-slate-500">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
          <p className="text-sm">Loading students...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchStudents}
            className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-medium hover:bg-rose-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table Data */}
      {!loading && !error && (
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id || index} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3.5 font-medium text-slate-400">{index + 1}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{student.name}</td>
                    <td className="px-4 py-3.5 text-slate-600">{student.email}</td>
                    <td className="px-4 py-3.5 text-slate-600">{student.phone || student.contact || '-'}</td>
                    <td className="px-4 py-3.5 text-right text-xs text-slate-400">
                      {student.created_at
                        ? new Date(student.created_at).toLocaleDateString()
                        : 'Recent'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-400 text-sm">
                    No students found.
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

