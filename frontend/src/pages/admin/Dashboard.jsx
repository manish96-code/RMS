import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from '../../components/AdminSidebar'
import { restaurantService } from '../../services/restaurantService'
import { categoryService } from '../../services/categoryService'
import { menuItemService } from '../../services/menuItemService'
import { tableService } from '../../services/tableService'
import { authService } from '../../services/authService'

const Dashboard = () => {
  const { user, logout } = useAuth()

  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)

  // System Metric Counts
  const [stats, setStats] = useState({
    categoriesCount: 0,
    itemsCount: 0,
    availableItemsCount: 0,
    tablesCount: 0,
    availableTablesCount: 0,
    occupiedTablesCount: 0,
    staffCount: 0,
    activeStaffCount: 0,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)

      const [restRes, catRes, itemRes, tableRes, staffRes] = await Promise.all([
        restaurantService.getRestaurant().catch(() => ({ ok: false })),
        categoryService.getCategories().catch(() => ({ ok: false })),
        menuItemService.getMenuItems().catch(() => ({ ok: false })),
        tableService.getTables().catch(() => ({ ok: false })),
        authService.getStaff().catch(() => ({ ok: false })),
      ])

      // Restaurant Data
      if (restRes.ok && restRes.data?.success && restRes.data?.data) {
        setRestaurant(restRes.data.data)
      } else {
        setRestaurant(null)
      }

      // Categories Count
      const catList = (catRes.ok && catRes.data?.success && catRes.data?.data) || []
      // Menu Items Count
      const itemList = (itemRes.ok && itemRes.data?.success && itemRes.data?.data) || []
      const availableItems = itemList.filter((i) => i.is_available).length

      // Tables Count
      const tableList = (tableRes.ok && tableRes.data?.success && tableRes.data?.data) || []
      const availableTables = tableList.filter((t) => t.status === 'available').length
      const occupiedTables = tableList.filter((t) => t.status === 'occupied').length

      // Staff Count
      const staffList = (staffRes.ok && staffRes.data?.success && staffRes.data?.data?.staff) || []
      const activeStaff = staffList.filter((s) => s.status === 'active').length

      setStats({
        categoriesCount: catList.length,
        itemsCount: itemList.length,
        availableItemsCount: availableItems,
        tablesCount: tableList.length,
        availableTablesCount: availableTables,
        occupiedTablesCount: occupiedTables,
        staffCount: staffList.length,
        activeStaffCount: activeStaff,
      })

      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      <AdminSidebar dishesCount={stats.itemsCount} />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white uppercase tracking-wider">
                {user?.role || 'Admin'} Portal
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">{user?.email}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Executive Dashboard 👋
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/restaurant"
              className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shadow-2xs flex items-center gap-1.5"
            >
              <span>🏪</span>
              <span>Restaurant Settings</span>
            </Link>

            <Link
              to="/profile"
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl transition shadow-2xs flex items-center gap-1.5"
            >
              <span>👤</span>
              <span>Profile</span>
            </Link>

            <button
              onClick={logout}
              className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Restaurant Banner Component */}
        {!loading && (
          <div>
            {restaurant ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center gap-5">
                  {/* Restaurant Logo Box */}
                  <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                    {restaurant.logo_url ? (
                      <img
                        src={restaurant.logo_url}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🍽️</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-bold text-slate-900">{restaurant.name}</h2>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                          restaurant.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        ● {restaurant.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      📍 {restaurant.address ? `${restaurant.address}, ${restaurant.city}` : 'Main Outlet'} 
                      <span className="mx-2 text-slate-300">|</span> 
                      📞 {restaurant.phone || 'N/A'} 
                      <span className="mx-2 text-slate-300">|</span> 
                      ⏰ {restaurant.opening_time || '10:00'} - {restaurant.closing_time || '22:00'}
                    </p>

                    {restaurant.gst_number && (
                      <p className="text-[11px] text-slate-400 font-mono">
                        GSTIN: {restaurant.gst_number}
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  to="/admin/restaurant"
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition shrink-0 self-start md:self-auto shadow-2xs"
                >
                  Edit Restaurant Details →
                </Link>
              </div>
            ) : (
              <div className="bg-amber-50/90 border border-amber-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 text-lg">⚠️</span>
                    <h3 className="text-base font-bold text-amber-900">Restaurant Setup Incomplete</h3>
                  </div>
                  <p className="text-xs text-amber-800 font-medium">
                    Configure your restaurant name, address, phone, timings, and logo to personalize customer receipts & POS system.
                  </p>
                </div>

                <Link
                  to="/admin/restaurant"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-2xs transition shrink-0 self-start md:self-auto"
                >
                  Complete Restaurant Setup →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Live System Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Restaurant Info */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg">
                🏪
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Profile
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Outlet Status</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {restaurant ? restaurant.name : 'Not Configured'}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between font-medium">
              <span>Status:</span>
              <span className="font-bold text-emerald-600">{restaurant?.status || 'Incomplete'}</span>
            </div>
          </div>

          {/* Card 2: Food Categories & Menu */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
                🍕
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                {stats.categoriesCount} Categories
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Total Food Dishes</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {stats.itemsCount} Items
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between font-medium">
              <span>Available Dishes:</span>
              <span className="font-bold text-slate-800">{stats.availableItemsCount} Items</span>
            </div>
          </div>

          {/* Card 3: Tables & Seating */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-lg">
                🪑
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                {stats.tablesCount} Tables
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Available Dining Tables</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-0.5">
                {stats.availableTablesCount} Available
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between font-medium">
              <span>Occupied Seating:</span>
              <span className="font-bold text-rose-600">{stats.occupiedTablesCount} Tables</span>
            </div>
          </div>

          {/* Card 4: Staff Team */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                👥
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                {stats.staffCount} Staff
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Active Staff Roster</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {stats.activeStaffCount} Active
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between font-medium">
              <span>Duty Status:</span>
              <span className="font-bold text-blue-600">On-Duty</span>
            </div>
          </div>

        </div>

        {/* Quick Management Module Navigation Hub */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Restaurant Control Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Module 1: Restaurant Setup */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                🏪
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">1. Restaurant Profile</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage outlet name, address, GSTIN, timings, and logo image.
                </p>
              </div>
              <Link
                to="/admin/restaurant"
                className="inline-block pt-1 text-xs font-bold text-slate-900 hover:underline"
              >
                Configure Settings →
              </Link>
            </div>

            {/* Module 2: Menu Management */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                🍕
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">2. Menu & Categories</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Create categories, food items, upload photos, set prices & availability.
                </p>
              </div>
              <Link
                to="/admin/menu"
                className="inline-block pt-1 text-xs font-bold text-slate-900 hover:underline"
              >
                Manage Digital Menu →
              </Link>
            </div>

            {/* Module 3: Table Management */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                🪑
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">3. Seating Floor Plan</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add dining tables, seat capacities, and view real-time table statuses.
                </p>
              </div>
              <Link
                to="/admin/tables"
                className="inline-block pt-1 text-xs font-bold text-slate-900 hover:underline"
              >
                Manage Floor Layout →
              </Link>
            </div>

            {/* Module 4: Staff Roster */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                👥
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">4. Staff Management</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Register staff members, manage roles, and toggle active duty status.
                </p>
              </div>
              <Link
                to="/admin/staff"
                className="inline-block pt-1 text-xs font-bold text-slate-900 hover:underline"
              >
                Manage Staff Team →
              </Link>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}

export default Dashboard
