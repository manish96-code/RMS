import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import TableList from '../../../components/tables/TableList'
import { tableService } from '../../../services/tableService'

const StaffTables = () => {
  const { user, logout } = useAuth()

  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchTables = async () => {
    setLoading(true)
    const { ok, data } = await tableService.getTables()
    if (ok && data.success) {
      setTables(data.data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const filteredTables = tables.filter((t) => {
    if (!statusFilter) return true
    return t.status === statusFilter
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
              🍽️
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-sm block">Gourmet Haven</span>
              <span className="text-[10px] text-slate-500 font-medium block">Staff Seating Terminal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/staff/dashboard"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              ← Dashboard
            </Link>

            <Link
              to="/staff/menu"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              📖 View Menu
            </Link>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto p-6 space-y-6">
        
        {/* Page Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Staff Seating Selection</span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Floor Map & Table Availability</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an available dining table to seat guests and start taking orders
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
              🟢 {tables.filter((t) => t.status === 'available').length} Tables Available
            </span>
          </div>
        </div>

        {/* Status Filter Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
          <span className="text-slate-700">Filter Seating Availability</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                statusFilter === ''
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Tables ({tables.length})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                statusFilter === 'available'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              🟢 Available ({tables.filter((t) => t.status === 'available').length})
            </button>
            <button
              onClick={() => setStatusFilter('occupied')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                statusFilter === 'occupied'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              🔴 Occupied ({tables.filter((t) => t.status === 'occupied').length})
            </button>
          </div>
        </div>

        {/* Loading & Read-Only Table List */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading floor seating...</p>
          </div>
        ) : (
          <TableList
            tables={filteredTables}
            isAdmin={false}
          />
        )}

      </main>

    </div>
  )
}

export default StaffTables
