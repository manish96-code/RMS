import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute, AdminRoute, StaffRoute } from './components/ProtectedRoute'

// Auth Pages
import Login from './pages/auth/Login'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import RestaurantSettings from './pages/admin/restaurant/RestaurantSettings'
import CategoryManagement from './pages/admin/categories/CategoryManagement'
import MenuManagement from './pages/admin/menu/MenuManagement'
import TableManagement from './pages/admin/tables/TableManagement'
import AdminOrders from './pages/admin/orders/Orders'
import AdminOrderDetails from './pages/admin/orders/OrderDetails'
import StaffManagement from './pages/admin/StaffManagement'
import AddProduct from './pages/admin/AddProduct'
import ManageProducts from './pages/admin/ManageProducts'
import EditProduct from './pages/admin/EditProduct'
import ViewProduct from './pages/admin/ViewProduct'
import ManageTables from './pages/admin/ManageTables'
import Transactions from './pages/admin/Transactions'

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard'
import StaffMenu from './pages/staff/menu/StaffMenu'
import StaffTables from './pages/staff/tables/StaffTables'
import CreateOrder from './pages/staff/orders/CreateOrder'
import StaffOrders from './pages/staff/orders/Orders'
import StaffOrderDetails from './pages/staff/orders/OrderDetails'

// Kitchen KDS Page
import KitchenDashboard from './pages/kitchen/KitchenDashboard'

// Billing & Receipt Pages
import BillPage from './pages/staff/billing/BillPage'
import ReceiptPage from './pages/staff/billing/ReceiptPage'

// Settings & Profile Pages
import Settings from './pages/admin/Settings'
import Profile from './pages/profile/Profile'

// General Pages
import Home from './pages/Home'

const AppContent = () => {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const isAuthPage = location.pathname === '/login'
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      {/* Global React Hot Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            fontSize: '12px',
            fontWeight: '600',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Top Navbar (Shown when not on Login or Admin workspace) */}
      {!isAuthPage && !isAdminPage && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
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

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 ml-4">
                <Link
                  to="/"
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    location.pathname === '/'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  POS Terminal
                </Link>

                {isAuthenticated && (
                  <Link
                    to="/kitchen"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
                  >
                    <span>👨‍🍳</span> Kitchen KDS
                  </Link>
                )}

                {isAuthenticated && user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                  >
                    Admin Panel ↗
                  </Link>
                )}

                {isAuthenticated && user?.role === 'staff' && (
                  <Link
                    to="/staff/dashboard"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                  >
                    Staff Dashboard ↗
                  </Link>
                )}
              </nav>
            </div>

            {/* Right Status & Auth Action Buttons */}
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

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                  >
                    👤 Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-2xs"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      {/* App Main Workspace Routes */}
      <main className="flex-1">
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected General Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/restaurant" element={<RestaurantSettings />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/menu" element={<MenuManagement />} />
            <Route path="/admin/tables" element={<TableManagement />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
            <Route path="/admin/staff" element={<StaffManagement />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/view-product/:id" element={<ViewProduct />} />
            <Route path="/admin/edit-product/:id" element={<EditProduct />} />
            <Route path="/admin/transactions" element={<Transactions />} />
            <Route path="/admin/kitchen" element={<KitchenDashboard />} />
            <Route path="/admin/orders/:id/bill" element={<BillPage />} />
            <Route path="/admin/orders/:id/receipt" element={<ReceiptPage />} />
            <Route path="/admin/reports" element={<SalesReport />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Protected Staff Routes */}
          <Route element={<StaffRoute />}>
            <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/menu" element={<StaffMenu />} />
            <Route path="/staff/tables" element={<StaffTables />} />
            <Route path="/staff/orders" element={<StaffOrders />} />
            <Route path="/staff/orders/create" element={<CreateOrder />} />
            <Route path="/staff/orders/:id" element={<StaffOrderDetails />} />
            <Route path="/staff/orders/:id/bill" element={<BillPage />} />
            <Route path="/staff/orders/:id/receipt" element={<ReceiptPage />} />
            <Route path="/staff/kitchen" element={<KitchenDashboard />} />
            <Route path="/kitchen" element={<KitchenDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  )
}

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
)

export default App
