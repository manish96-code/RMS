import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from '../../components/AdminSidebar'

const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      <AdminSidebar />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                {user?.role || 'Admin'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Logged in as {user?.email}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Restaurant Owner'}! 👋
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl transition shadow-2xs"
            >
              👤 Profile & Password
            </Link>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Quick Action Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-2xl block">👥</span>
            <h2 className="text-sm font-bold text-slate-900">Staff Management</h2>
            <p className="text-xs text-slate-500">Register new staff members, toggle active status, manage roles.</p>
            <Link
              to="/admin/staff"
              className="inline-block pt-2 text-xs font-bold text-slate-900 hover:underline"
            >
              Manage Staff Roster →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-2xl block">🍽️</span>
            <h2 className="text-sm font-bold text-slate-900">Digital Menu Products</h2>
            <p className="text-xs text-slate-500">Add dishes, set prices, preparation times, images.</p>
            <Link
              to="/admin/products"
              className="inline-block pt-2 text-xs font-bold text-slate-900 hover:underline"
            >
              Manage Menu Items →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-2xl block">🪑</span>
            <h2 className="text-sm font-bold text-slate-900">Restaurant Seating</h2>
            <p className="text-xs text-slate-500">Manage seating layout, floor map, table capacity.</p>
            <Link
              to="/admin/tables"
              className="inline-block pt-2 text-xs font-bold text-slate-900 hover:underline"
            >
              Manage Tables →
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}

export default Dashboard
