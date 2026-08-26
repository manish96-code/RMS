import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const StaffDashboard = () => {
  const { user, logout } = useAuth()

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
              <span className="text-[10px] text-slate-500 font-medium block">Staff Terminal</span>
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
              to="/staff/menu"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              📖 View Menu
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Staff Member Dashboard</span>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
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

        {/* Staff Operations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-3xl block">📖</span>
            <h2 className="text-base font-bold text-slate-900">Digital Menu Directory</h2>
            <p className="text-xs text-slate-500">Browse food categories, prices, ingredients and live availability status.</p>
            <Link
              to="/staff/menu"
              className="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
            >
              View Menu Catalog →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-3xl block">📋</span>
            <h2 className="text-base font-bold text-slate-900">Take Customer Order</h2>
            <p className="text-xs text-slate-500">Access POS terminal to create new dine-in or takeaway orders for customers.</p>
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
            >
              Open POS Terminal →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-3xl block">👤</span>
            <h2 className="text-base font-bold text-slate-900">My Profile & Security</h2>
            <p className="text-xs text-slate-500">Update your contact information, mobile number or change account password.</p>
            <Link
              to="/profile"
              className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              View Profile →
            </Link>
          </div>

        </div>

      </main>

    </div>
  )
}

export default StaffDashboard
