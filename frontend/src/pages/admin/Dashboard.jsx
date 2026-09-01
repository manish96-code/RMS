import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from '../../components/AdminSidebar'
import OrderStatus from '../../components/orders/OrderStatus'
import { dashboardService } from '../../services/dashboardService'
import { restaurantService } from '../../services/restaurantService'

const Dashboard = () => {
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    today: { total_orders: 0, completed_orders: 0, sales: 0 },
    tables: { total: 0, available: 0, occupied: 0, reserved: 0 },
    active_orders: { pending: 0, preparing: 0, ready: 0, served: 0 },
    recent_orders: [],
  })

  // Fetch Dashboard and Restaurant Data
  const fetchDashboard = async () => {
    setLoading(true)
    const [dashRes, restRes] = await Promise.all([
      dashboardService.getDashboard().catch(() => ({ ok: false })),
      restaurantService.getRestaurant().catch(() => ({ ok: false })),
    ])

    if (dashRes.ok && dashRes.data?.success) {
      setDashboardData(dashRes.data.data)
    }

    if (restRes.ok && restRes.data?.success && restRes.data?.data) {
      setRestaurant(restRes.data.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      <AdminSidebar />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {restaurant?.name || 'Restaurant Management System'}
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              Executive Executive Dashboard 👋
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Overview of today's sales performance, table capacity & operational orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>🔄</span> Refresh Stats
            </button>

            <Link
              to="/staff/orders/create"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition"
            >
              + POS Take Order
            </Link>
          </div>
        </div>

        {/* 1. Summary Cards Grid (5 Key Performance Indicators) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Today's Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Orders</span>
              <span className="text-lg">📋</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {loading ? '...' : dashboardData.today?.total_orders || 0}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Orders created today</p>
          </div>

          {/* Card 2: Completed Today */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Today</span>
              <span className="text-lg">✅</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {loading ? '...' : dashboardData.today?.completed_orders || 0}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">Fully settled orders</p>
          </div>

          {/* Card 3: Today's Sales */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Sales</span>
              <span className="text-lg">💰</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {loading ? '...' : `₹${Number(dashboardData.today?.sales || 0).toLocaleString()}`}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">From successful payments</p>
          </div>

          {/* Card 4: Available Tables */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Tables</span>
              <span className="text-lg">🪑</span>
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {loading ? '...' : dashboardData.tables?.available || 0}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Out of {dashboardData.tables?.total || 0} total tables</p>
          </div>

          {/* Card 5: Occupied Tables */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Occupied Tables</span>
              <span className="text-lg">🔴</span>
            </div>
            <div className="text-2xl font-black text-rose-700">
              {loading ? '...' : dashboardData.tables?.occupied || 0}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Guests dining currently</p>
          </div>
        </div>

        {/* 2. Active Orders Status Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>⚡</span> Active Kitchen & Floor Orders Breakdown
              </h3>
              <p className="text-xs text-slate-500">Live operational status of dining orders</p>
            </div>
            <Link to="/admin/kitchen" className="text-xs font-bold text-slate-900 hover:underline">
              Open Kitchen KDS 👨‍🍳 →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
              <span className="text-amber-800 text-[11px] font-bold block uppercase tracking-wider">⏳ Pending</span>
              <span className="text-2xl font-black text-amber-900 block">
                {loading ? '...' : dashboardData.active_orders?.pending || 0}
              </span>
              <span className="text-[11px] text-amber-700 font-medium">New tickets waiting</span>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
              <span className="text-blue-800 text-[11px] font-bold block uppercase tracking-wider">🔥 Preparing</span>
              <span className="text-2xl font-black text-blue-900 block">
                {loading ? '...' : dashboardData.active_orders?.preparing || 0}
              </span>
              <span className="text-[11px] text-blue-700 font-medium">Cooking on stove</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <span className="text-emerald-800 text-[11px] font-bold block uppercase tracking-wider">🟢 Ready</span>
              <span className="text-2xl font-black text-emerald-900 block">
                {loading ? '...' : dashboardData.active_orders?.ready || 0}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">Waiting for pickup</span>
            </div>

            <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-slate-700 text-[11px] font-bold block uppercase tracking-wider">🍽️ Served</span>
              <span className="text-2xl font-black text-slate-900 block">
                {loading ? '...' : dashboardData.active_orders?.served || 0}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Served to customer</span>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions Bar */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>🚀</span> Executive Quick Management Toolbar
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Direct quick links for rapid restaurant navigation
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-bold">
            <Link
              to="/staff/orders/create"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 text-center transition flex flex-col items-center gap-1.5"
            >
              <span className="text-lg">🛒</span>
              <span>Take Order</span>
            </Link>

            <Link
              to="/admin/kitchen"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 text-center transition flex flex-col items-center gap-1.5"
            >
              <span className="text-lg">👨‍🍳</span>
              <span>Kitchen Display</span>
            </Link>

            <Link
              to="/admin/tables"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 text-center transition flex flex-col items-center gap-1.5"
            >
              <span className="text-lg">🪑</span>
              <span>Manage Tables</span>
            </Link>

            <Link
              to="/admin/menu"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 text-center transition flex flex-col items-center gap-1.5"
            >
              <span className="text-lg">🍕</span>
              <span>Manage Menu</span>
            </Link>

            <Link
              to="/admin/staff"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 text-center transition flex flex-col items-center gap-1.5"
            >
              <span className="text-lg">👥</span>
              <span>Manage Staff</span>
            </Link>

            <Link
              to="/admin/reports"
              className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-center transition flex flex-col items-center gap-1.5 shadow-2xs"
            >
              <span className="text-lg">📈</span>
              <span>Sales Reports</span>
            </Link>
          </div>
        </div>

        {/* 4. Recent Orders Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>📋</span> Recent Orders Roster
              </h3>
              <p className="text-xs text-slate-500">Latest customer dining orders placed</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-slate-900 hover:underline">
              View All Orders ({dashboardData.today?.total_orders || 0}) →
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold">
              Loading recent orders...
            </div>
          ) : dashboardData.recent_orders?.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <span className="text-3xl block">📋</span>
              <p className="text-xs font-bold text-slate-600">No Orders Created Yet Today</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Order #</th>
                    <th className="px-4 py-3">Table</th>
                    <th className="px-4 py-3">Staff</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {dashboardData.recent_orders?.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3.5 font-bold text-slate-900 font-mono">
                        #{ord.order_number}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        Table {ord.table_number}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700">{ord.staff_name}</td>
                      <td className="px-4 py-3.5 font-extrabold text-slate-900 text-sm">
                        ₹{Number(ord.total).toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">
                        <OrderStatus status={ord.status} />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          to={`/admin/orders/${ord.id}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
