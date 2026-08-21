import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const StaffRoster = () => {
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/dashboard`)
      .then((res) => res.json())
      .then((data) => {
        setAdminData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const staff = adminData?.staff || []

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased text-left font-sans">
      <AdminSidebar />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff & Duty Roster</h1>
            <p className="text-xs text-slate-500 mt-0.5">Active kitchen chefs, waiters and cashiers shift logs</p>
          </div>

          <Link
            to="/create"
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
          >
            + Register Staff Member
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading staff roster...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {staff.map((member, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{member.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      member.status === 'On Duty'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{member.role}</p>
                <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                  Orders Processed: <span className="font-bold text-slate-900">{member.orders_handled}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default StaffRoster
