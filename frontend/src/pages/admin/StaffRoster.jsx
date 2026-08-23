import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const StaffRoster = () => {
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const fetchStaff = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/api/staff`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch staff members')
        return res.json()
      })
      .then((data) => {
        setStaffList(data.staff || data.data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching staff:', err)
        setError('Failed to fetch staff roster. Check backend server connection.')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleDeleteStaff = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove staff member "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/staff/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setStaffList((prev) => prev.filter((s) => s.id !== id))
        showToast(`Staff member "${name}" removed.`)
      } else {
        alert('Failed to delete staff member.')
      }
    } catch {
      alert('Unable to connect to server.')
    }
  }

  const handleToggleDutyStatus = async (staffMember) => {
    const nextStatus = staffMember.status === 'On Duty' ? 'Off Duty' : 'On Duty'

    try {
      const response = await fetch(`${API_BASE_URL}/api/staff/${staffMember.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (response.ok) {
        setStaffList((prev) =>
          prev.map((s) => (s.id === staffMember.id ? { ...s, status: nextStatus } : s))
        )
        showToast(`Updated ${staffMember.name}'s duty status to "${nextStatus}".`)
      }
    } catch {
      alert('Unable to update staff status.')
    }
  }

  const handleToggleActiveStatus = async (staffMember) => {
    const nextActiveState = !staffMember.is_active

    try {
      const response = await fetch(`${API_BASE_URL}/api/staff/${staffMember.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: nextActiveState }),
      })

      if (response.ok) {
        setStaffList((prev) =>
          prev.map((s) => (s.id === staffMember.id ? { ...s, is_active: nextActiveState } : s))
        )
        showToast(`Account for ${staffMember.name} set to ${nextActiveState ? 'Active' : 'Inactive'}.`)
      }
    } catch {
      alert('Unable to update active status.')
    }
  }

  const filteredStaff = staffList.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = staffList.filter((s) => s.is_active).length
  const onDutyCount = staffList.filter((s) => s.status === 'On Duty' && s.is_active).length

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased text-left font-sans">
      
      {/* Shared Admin Sidebar */}
      <AdminSidebar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-md flex items-center gap-2 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff & Duty Roster</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Active kitchen chefs, waiters, cashiers & user account management ({staffList.length} total users)
            </p>
          </div>

          <Link
            to="/admin/add-staff"
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span> Register Staff Member
          </Link>
        </div>

        {/* Summary Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Registered</span>
            <span className="text-xl font-bold text-slate-900">{staffList.length}</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Active Accounts (is_active)</span>
            <span className="text-xl font-bold text-emerald-700">{activeCount}</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">On Duty Today</span>
            <span className="text-xl font-bold text-blue-700">{onDutyCount}</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Shifts</span>
            <span className="text-xl font-bold text-slate-700">3 Shifts</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-700">Staff User Directory</span>
          <input
            type="text"
            placeholder="Search staff by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg focus:outline-none focus:border-slate-800 transition"
          />
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading staff user roster...</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchStaff} className="underline font-semibold">Retry</button>
          </div>
        )}

        {/* Detailed Table View */}
        {!loading && !error && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-3 p-5">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Staff Users List ({filteredStaff.length})
            </h2>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Staff Name</th>
                    <th className="px-4 py-3">Email / Contact</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Shift</th>
                    <th className="px-4 py-3">Account Status (is_active)</th>
                    <th className="px-4 py-3">Duty Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 font-mono text-slate-400">#{member.id}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{member.name}</td>
                      <td className="px-4 py-3.5 text-slate-600">
                        <div>{member.email}</div>
                        <div className="text-[10px] text-slate-400">{member.phone}</div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{member.role}</td>
                      <td className="px-4 py-3.5 text-slate-600">{member.shift || 'Morning'}</td>

                      {/* is_active Toggle Button */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleActiveStatus(member)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition ${
                            member.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {member.is_active ? '🟢 Active' : '🔴 Inactive'}
                        </button>
                      </td>

                      {/* Duty Status Toggle */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleDutyStatus(member)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                            member.status === 'On Duty'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {member.status}
                        </button>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteStaff(member.id, member.name)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded text-xs font-semibold transition cursor-pointer"
                        >
                          🗑️ Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  )
}

export default StaffRoster
