import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import Edit from './pages/Edit'

// Admin Pages Structure
import AdminDashboard from './pages/admin/AdminDashboard'
import AddProduct from './pages/admin/AddProduct'
import ManageProducts from './pages/admin/ManageProducts'
import EditProduct from './pages/admin/EditProduct'
import ViewProduct from './pages/admin/ViewProduct'
import ManageTables from './pages/admin/ManageTables'
import Transactions from './pages/admin/Transactions'
import StaffRoster from './pages/admin/StaffRoster'
import AddStaff from './pages/admin/AddStaff'
import EditStaff from './pages/admin/EditStaff'

const App = () => {
  const location = useLocation()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      {/* Top Navbar (Only shown on non-admin routes) */}
      {!isAdminPage && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Logo & Brand Identity */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg group-hover:bg-slate-800 transition">
                  🍽️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 tracking-tight text-base">Gourmet Haven</span>
                    <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      POS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                    Restaurant Operating System
                  </p>
                </div>
              </Link>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 ml-4">
                <Link
                  to="/"
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition ${
                    location.pathname === '/'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  POS Terminal
                </Link>

                <Link
                  to="/admin"
                  className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Admin Panel ↗
                </Link>

                <Link
                  to="/create"
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition ${
                    location.pathname === '/create'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Staff Directory
                </Link>
              </nav>
            </div>

            {/* Right Header Status Bar & Live Clock */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {time.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              <Link
                to="/admin"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition"
              >
                Admin Suite
              </Link>
            </div>

          </div>
        </header>
      )}

      {/* Main Page Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/view-product/:id" element={<ViewProduct />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/tables" element={<ManageTables />} />
          <Route path="/admin/staff" element={<StaffRoster />} />
          <Route path="/admin/add-staff" element={<AddStaff />} />
          <Route path="/admin/edit-staff/:id" element={<EditStaff />} />
          <Route path="/admin/transactions" element={<Transactions />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
