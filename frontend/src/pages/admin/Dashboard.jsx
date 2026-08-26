import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from '../../components/AdminSidebar'
import { restaurantService } from '../../services/restaurantService'

const Dashboard = () => {
  const { user, logout } = useAuth()

  const [restaurant, setRestaurant] = useState(null)
  const [loadingRestaurant, setLoadingRestaurant] = useState(true)

  useEffect(() => {
    const fetchRestaurant = async () => {
      const { ok, data } = await restaurantService.getRestaurant()
      if (ok && data.success && data.data) {
        setRestaurant(data.data)
      } else {
        setRestaurant(null)
      }
      setLoadingRestaurant(false)
    }

    fetchRestaurant()
  }, [])

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
              to="/admin/restaurant"
              className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition shadow-2xs"
            >
              🏪 Restaurant Settings
            </Link>

            <Link
              to="/profile"
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl transition shadow-2xs"
            >
              👤 Profile
            </Link>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Restaurant Status Banner (Requirement 16) */}
        {!loadingRestaurant && (
          <div>
            {restaurant ? (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Restaurant Logo */}
                  <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                    {restaurant.logo_url ? (
                      <img
                        src={restaurant.logo_url}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🍽️</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">{restaurant.name}</h2>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                          restaurant.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {restaurant.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {restaurant.address ? `${restaurant.address}, ${restaurant.city}` : 'No address set'} | Phone: {restaurant.phone || 'N/A'} | Timings: {restaurant.opening_time} - {restaurant.closing_time}
                    </p>
                  </div>
                </div>

                <Link
                  to="/admin/restaurant"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition shrink-0 self-start sm:self-auto"
                >
                  Edit Restaurant Details
                </Link>
              </div>
            ) : (
              <div className="bg-amber-50/80 border border-amber-200/80 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <h3 className="text-sm font-bold text-amber-900">Restaurant setup is incomplete.</h3>
                  <p className="text-xs text-amber-800">
                    Configure your restaurant name, address, phone, timings, and logo to enable POS billing and reports.
                  </p>
                </div>

                <Link
                  to="/admin/restaurant"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-2xs transition shrink-0 self-start sm:self-auto"
                >
                  Complete Restaurant Setup
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Module Nav Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-2xl block">🏪</span>
            <h2 className="text-sm font-bold text-slate-900">Restaurant Profile</h2>
            <p className="text-xs text-slate-500">Manage basic info, GST number, logo and timing settings.</p>
            <Link
              to="/admin/restaurant"
              className="inline-block pt-2 text-xs font-bold text-slate-900 hover:underline"
            >
              Configure Restaurant →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-2xl block">👥</span>
            <h2 className="text-sm font-bold text-slate-900">Staff Management</h2>
            <p className="text-xs text-slate-500">Register staff members, toggle active status, manage roles.</p>
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
        </div>

      </main>
    </div>
  )
}

export default Dashboard
