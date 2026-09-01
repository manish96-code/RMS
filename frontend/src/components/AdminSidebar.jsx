import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const AdminSidebar = ({ dishesCount = 0 }) => {
  const location = useLocation()

  const navItems = [
    { path: '/admin', label: 'Dashboard Overview', icon: '📊' },
    { path: '/admin/reports', label: 'Sales Reports', icon: '📈' },
    { path: '/admin/orders', label: 'Orders Management', icon: '📋' },
    { path: '/admin/kitchen', label: 'Kitchen Display (KDS)', icon: '👨‍🍳' },
    { path: '/admin/settings', label: 'System Settings', icon: '⚙️' },
    { path: '/admin/categories', label: 'Category Management', icon: '📁' },
    { path: '/admin/menu', label: 'Menu Management', icon: '🍕', badge: dishesCount },
    { path: '/admin/tables', label: 'Manage Tables', icon: '🪑' },
    { path: '/admin/staff', label: 'Staff Directory', icon: '👥' },
    { path: '/profile', label: 'My Profile & Security', icon: '👤' },
    { path: '/admin/transactions', label: 'Transactions Log', icon: '💳' },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen select-none shrink-0">
      
      <div className="space-y-6">
        {/* Sidebar Brand Header */}
        <Link to="/admin" className="flex items-center gap-3 px-2 py-1 group">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-base group-hover:scale-105 transition">
            🍽️
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-sm">Gourmet Haven</div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Admin Portal
            </div>
          </div>
        </Link>

        <div className="h-px bg-slate-800/80"></div>

        {/* Navigation Links */}
        <nav className="space-y-1 text-xs font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span> {item.label}
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-semibold border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          <div className="pt-4 border-t border-slate-800/80 space-y-1">
            <Link
              to="/"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <span>💻</span> Open POS Terminal
              </div>
              <span>↗</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Sidebar Footer User Card */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Restaurant Admin</div>
            <div className="text-[10px] text-slate-400">Owner Portal</div>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online"></span>
      </div>

    </aside>
  )
}

export default AdminSidebar
