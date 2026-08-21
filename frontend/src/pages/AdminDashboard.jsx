import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../config'

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Interactive Admin State
  const [timeRange, setTimeRange] = useState('This Week')
  const [activeSection, setActiveSection] = useState('overview') // 'overview', 'sales', 'menu', 'staff', 'transactions'
  const [toastNotice, setToastNotice] = useState('')
  const [showAddDishModal, setShowAddDishModal] = useState(false)

  // New Dish Modal State
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    prep_time: '15 mins',
  })

  const fetchAdminData = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/api/admin/dashboard`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load admin dashboard API')
        return res.json()
      })
      .then((data) => {
        setAdminData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching admin data:', err)
        setError('Failed to fetch admin analytics. Check backend server connection.')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const stats = adminData?.stats || {
    total_revenue: 348500,
    today_revenue: 42850,
    weekly_revenue: 245000,
    total_orders: 1240,
    today_orders: 38,
    avg_order_value: 1127,
    total_customers: 890,
    total_staff: 5,
    active_dishes: 45,
    occupied_tables: '9 / 15',
  }

  const weeklySales = adminData?.weekly_sales || []
  const topDishes = adminData?.top_dishes || []
  const recentTransactions = adminData?.recent_transactions || []
  const staff = adminData?.staff || []

  // Max sales for bar scaling
  const maxSales = Math.max(...weeklySales.map((s) => s.sales), 1)

  const showToast = (msg) => {
    setToastNotice(msg)
    setTimeout(() => setToastNotice(''), 3000)
  }

  const handleCreateDishSubmit = (e) => {
    e.preventDefault()
    setShowAddDishModal(false)
    showToast(`New Dish "${newDish.name}" added to menu! 🍕`)
    setNewDish({ name: '', category: 'Main Course', price: '', prep_time: '15 mins' })
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      
      {/* Toast Notification */}
      {toastNotice && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-base">⚙️</span>
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Add New Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-scale-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Add New Menu Item</h3>
                <p className="text-xs text-slate-500 mt-0.5">Publish new dish to POS & Customer Menu</p>
              </div>
              <button
                onClick={() => setShowAddDishModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDishSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Dish Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  placeholder="e.g. Garlic Butter Naan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Pizzas">Pizzas</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    placeholder="e.g. 180"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Publish Dish
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-4 py-3 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Top Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider rounded-full">
              👑 Admin Control Center
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Restaurant Management System</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Executive Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
            Real-time restaurant analytics, sales performance, staff management & financial reports.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3.5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-700 focus:outline-none shadow-xs"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Quarter">This Quarter</option>
          </select>

          <button
            onClick={() => setShowAddDishModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>➕</span> Add Dish
          </button>

          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 text-xs transition cursor-pointer"
            title="Refresh Admin Data"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Overview Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Total Sales</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs">📈</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{stats.total_revenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">↑ +18.4% this month</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Today's Sales</span>
            <span className="p-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs">💵</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{stats.today_revenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-orange-600 font-bold mt-1">38 orders today</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Avg Order Value</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs">🛍️</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{stats.avg_order_value}
          </div>
          <p className="text-[10px] text-blue-600 font-bold mt-1">1,240 total orders</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Staff Count</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs">👥</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {stats.total_staff} <span className="text-xs text-slate-400 font-normal">staff</span>
          </div>
          <p className="text-[10px] text-purple-600 font-bold mt-1">Active RMS team</p>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Active Dishes</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs">🍕</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {stats.active_dishes} <span className="text-xs text-slate-400 font-normal">dishes</span>
          </div>
          <p className="text-[10px] text-amber-600 font-bold mt-1">5 categories</p>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeSection === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>📊</span> Revenue & Sales Analytics
        </button>

        <button
          onClick={() => setActiveSection('top_dishes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeSection === 'top_dishes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>⭐</span> Top Dishes & Menu Performance
        </button>

        <button
          onClick={() => setActiveSection('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeSection === 'transactions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>💳</span> Transactions Log
        </button>

        <button
          onClick={() => setActiveSection('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeSection === 'staff'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>👥</span> Staff & Duty Roster
        </button>

        <Link
          to="/create"
          className="ml-auto px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <span>➕</span> Manage Staff Directory
        </Link>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3"></div>
          <p className="text-xs font-semibold">Loading Admin Dashboard Analytics...</p>
        </div>
      )}

      {!loading && error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchAdminData} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* SECTION 1: REVENUE & SALES CHART */}
      {!loading && !error && activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Weekly Sales Visualizer Chart (8 / 12) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Weekly Revenue Performance</h3>
                <p className="text-xs text-slate-500 mt-0.5">Revenue Breakdown by Day of Week</p>
              </div>
              <span className="text-xs font-extrabold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                Weekly Total: ₹{stats.weekly_revenue.toLocaleString()}
              </span>
            </div>

            {/* Custom SVG/HTML Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 pb-4">
              {weeklySales.map((item, idx) => {
                const heightPercent = Math.round((item.sales / maxSales) * 100)
                const isHighlight = item.day === 'Sun' || item.day === 'Sat'

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none mb-1 whitespace-nowrap">
                      ₹{item.sales.toLocaleString()} ({item.orders} orders)
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 group-hover:scale-105 ${
                        isHighlight
                          ? 'bg-gradient-to-t from-orange-500 to-amber-400'
                          : 'bg-gradient-to-t from-slate-700 to-slate-900'
                      }`}
                    ></div>

                    <span className="text-xs font-bold text-slate-600 mt-2">{item.day}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-800"></span> Weekday Average: ₹38,500
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span> Weekend Peak: ₹70,000+
              </span>
            </div>
          </div>

          {/* Quick Admin Summary Cards (4 / 12) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
                Financial Highlights
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                  <span className="font-medium text-slate-600">Gross Sales</span>
                  <span className="font-extrabold text-slate-900">₹3,48,500</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                  <span className="font-medium text-slate-600">GST Collected (5%)</span>
                  <span className="font-extrabold text-slate-900">₹17,425</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                  <span className="font-medium text-slate-600">Discount Offered</span>
                  <span className="font-extrabold text-rose-600">- ₹4,200</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="font-bold text-emerald-900">Net Profit Margin</span>
                  <span className="font-black text-emerald-700 text-sm">34.8%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-slate-900 to-amber-950 text-white rounded-3xl p-6 shadow-lg space-y-3">
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">Quick Note</div>
              <h4 className="font-bold text-base">Peak Dining Hour Alert</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Saturday and Sunday dinner slots (07:30 PM - 09:30 PM) experience 100% table occupancy. Ensure kitchen prep team is fully staffed.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: TOP DISHES TABLE */}
      {!loading && !error && activeSection === 'top_dishes' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Top Selling Dishes & Menu Items</h3>
              <p className="text-xs text-slate-500 mt-0.5">Ranked by Sales Volume & Total Revenue Generated</p>
            </div>
            <button
              onClick={() => setShowAddDishModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              + Add New Item
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Dish Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Units Sold</th>
                  <th className="px-4 py-3">Total Revenue</th>
                  <th className="px-4 py-3">Customer Rating</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {topDishes.map((dish, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      {dish.name}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{dish.category}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">{dish.sales} units</td>
                    <td className="px-4 py-3.5 font-black text-slate-900">₹{dish.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-amber-600 font-bold">★ {dish.rating}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold rounded-lg text-[10px]">
                        In Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: RECENT TRANSACTIONS LOG */}
      {!loading && !error && activeSection === 'transactions' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Recent Financial Transactions</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time POS payments & customer billing log</p>
            </div>
            <span className="text-xs font-bold text-slate-500">Showing 5 latest transactions</span>
          </div>

          <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Txn ID</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Order Type</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 font-mono text-slate-400 font-bold">{txn.id}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">{txn.order_id}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{txn.customer}</td>
                    <td className="px-4 py-3.5 text-slate-600">{txn.type}</td>
                    <td className="px-4 py-3.5 text-slate-600">{txn.payment_method}</td>
                    <td className="px-4 py-3.5 font-black text-slate-900">₹{txn.amount}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`px-2.5 py-1 font-extrabold rounded-lg text-[10px] ${
                          txn.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: STAFF & DUTY ROSTER */}
      {!loading && !error && activeSection === 'staff' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Restaurant Staff & Duty Overview</h3>
              <p className="text-xs text-slate-500 mt-0.5">Active kitchen chefs, waiters, and cashiers</p>
            </div>
            <Link
              to="/create"
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-slate-800 transition"
            >
              + Register New Staff
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {staff.map((member, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{member.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      member.status === 'On Duty'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold">{member.role}</p>
                <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200/60">
                  Orders Processed Today: <span className="font-bold text-slate-900">{member.orders_handled}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboard
