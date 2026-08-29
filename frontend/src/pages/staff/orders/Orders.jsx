import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import OrderStatus from '../../../components/orders/OrderStatus'
import { orderService } from '../../../services/orderService'

const StaffOrders = () => {
  const { user, logout } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    const { ok, data } = await orderService.getOrders({
      status: statusFilter,
      search: searchQuery,
    })

    if (ok && data.success) {
      setOrders(data.data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, searchQuery])

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
              <span className="text-[10px] text-slate-500 font-medium block">Staff Orders Roster</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/staff/orders/create"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-2xs"
            >
              + Take New Order
            </Link>

            <Link
              to="/staff/dashboard"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              ← Dashboard
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
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Management</span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Dining Table Orders Roster</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              View active customer orders, update statuses to served and track billing history
            </p>
          </div>

          <Link
            to="/staff/orders/create"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition self-start sm:self-auto"
          >
            + Create New Order
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search by order # or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:border-slate-800 transition"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                statusFilter === '' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                statusFilter === 'pending' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              ⏳ Pending
            </button>
            <button
              onClick={() => setStatusFilter('served')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                statusFilter === 'served' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              🍽️ Served
            </button>
          </div>
        </div>

        {/* Orders Table List */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading orders roster...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-4xl block mb-2">📋</span>
            <h3 className="text-sm font-bold text-slate-700">No Orders Found</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click "+ Take New Order" above to place an order.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs p-4">
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Order #</th>
                    <th className="px-4 py-3">Table</th>
                    <th className="px-4 py-3">Staff</th>
                    <th className="px-4 py-3">Items Count</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 font-bold text-slate-900 font-mono">
                        #{ord.order_number}
                      </td>

                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        Table {ord.table?.table_number || 'N/A'}
                      </td>

                      <td className="px-4 py-3.5 text-slate-700">
                        {ord.staff?.name || 'Staff'}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">
                        {ord.items?.length || 0} Items
                      </td>

                      <td className="px-4 py-3.5 font-extrabold text-slate-900 text-sm">
                        ₹{Number(ord.total).toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5">
                        <OrderStatus status={ord.status} />
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <Link
                          to={`/staff/orders/${ord.id}`}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  )
}

export default StaffOrders
