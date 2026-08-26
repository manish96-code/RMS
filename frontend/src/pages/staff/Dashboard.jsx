import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { tableService } from '../../services/tableService'
import { menuItemService } from '../../services/menuItemService'

const StaffDashboard = () => {
  const { user, logout } = useAuth()

  const [availableTablesCount, setAvailableTablesCount] = useState(0)
  const [totalTablesCount, setTotalTablesCount] = useState(0)
  const [menuItemsCount, setMenuItemsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStaffStats = async () => {
      setLoading(true)

      const [tableRes, itemRes] = await Promise.all([
        tableService.getTables().catch(() => ({ ok: false })),
        menuItemService.getMenuItems().catch(() => ({ ok: false })),
      ])

      const tables = (tableRes.ok && tableRes.data?.success && tableRes.data?.data) || []
      const items = (itemRes.ok && itemRes.data?.success && itemRes.data?.data) || []

      setTotalTablesCount(tables.length)
      setAvailableTablesCount(tables.filter((t) => t.status === 'available').length)
      setMenuItemsCount(items.length)

      setLoading(false)
    }

    fetchStaffStats()
  }, [])

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
              <span className="text-[10px] text-slate-500 font-medium block">Staff Service Terminal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-800 block">{user?.name}</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                🟢 {user?.status || 'Active Staff'}
              </span>
            </div>

            <Link
              to="/staff/tables"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              🪑 Floor Seating
            </Link>

            <Link
              to="/staff/menu"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              📖 Digital Menu
            </Link>

            <Link
              to="/profile"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Profile
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

      {/* Main Content Workspace */}
      <main className="max-w-[1400px] mx-auto p-6 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              Staff Service Terminal
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-2">
              Welcome, {user?.name}! 👋
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact: {user?.mobile || user?.phone} | Email: {user?.email} | Shift: {user?.shift || 'Morning'}
            </p>
          </div>

          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
            Duty Status: Active Staff
          </div>
        </div>

        {/* Live Staff Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-semibold text-slate-500">Available Dining Tables</div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {loading ? '...' : `${availableTablesCount} / ${totalTablesCount} Free`}
            </div>
            <p className="text-[11px] text-slate-400">Ready for seating new customers</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-semibold text-slate-500">Digital Food Menu</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {loading ? '...' : `${menuItemsCount} Items`}
            </div>
            <p className="text-[11px] text-slate-400">Full catalog with prices & ingredients</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-xs font-semibold text-slate-500">POS Order Terminal</div>
            <div className="text-2xl font-extrabold text-slate-900">
              Ready
            </div>
            <p className="text-[11px] text-slate-400">Create new orders for dine-in & takeaway</p>
          </div>

        </div>

        {/* Staff Operations Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl">
              🪑
            </div>
            <h2 className="text-base font-bold text-slate-900">Floor Seating Map</h2>
            <p className="text-xs text-slate-500">View real-time table availability (Available / Occupied) and seat guests.</p>
            <Link
              to="/staff/tables"
              className="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-2xs"
            >
              Select Dining Table →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl">
              📖
            </div>
            <h2 className="text-base font-bold text-slate-900">Digital Menu Directory</h2>
            <p className="text-xs text-slate-500">Browse food categories, prices, ingredients and live availability status.</p>
            <Link
              to="/staff/menu"
              className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
            >
              View Menu Catalog →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl">
              📋
            </div>
            <h2 className="text-base font-bold text-slate-900">Take Customer Order</h2>
            <p className="text-xs text-slate-500">Access POS terminal to create new dine-in or takeaway orders for customers.</p>
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
            >
              Open POS Terminal →
            </Link>
          </div>

        </div>

      </main>

    </div>
  )
}

export default StaffDashboard
