import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../config'

const Home = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Interactive State
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('menu') // 'menu', 'tables', 'orders'
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [activeNotice, setActiveNotice] = useState('')

  const fetchRestaurantData = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/api/home`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load restaurant homepage data')
        return res.json()
      })
      .then((resData) => {
        setData(resData)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching restaurant homepage API:', err)
        setError('Could not connect to Restaurant Homepage API. Please ensure backend server is running.')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchRestaurantData()
  }, [])

  const restaurant = data?.restaurant || {
    name: 'Gourmet Haven Restaurant & Lounge',
    tagline: 'Fresh Flavors, Memorable Dining',
    status: 'Open & Serving',
    opening_hours: '10:00 AM - 11:00 PM',
    address: '124 Culinary Boulevard, Foodville',
    phone: '+1 (555) 234-5678',
  }

  const stats = data?.stats || {
    today_revenue: 42850,
    total_orders: 38,
    active_orders: 12,
    occupied_tables: 9,
    total_tables: 15,
    pending_kitchen: 4,
  }

  const categories = data?.categories || []
  const featuredDishes = data?.featured_dishes || []
  const tables = data?.tables || []
  const recentOrders = data?.recent_orders || []

  // Filter Dishes by Category and Search
  const filteredDishes = featuredDishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddToCart = (dishName) => {
    setCartItemsCount((prev) => prev + 1)
    setActiveNotice(`Added "${dishName}" to current order!`)
    setTimeout(() => setActiveNotice(''), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Toast Notification */}
      {activeNotice && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-xl">🛒</span>
          <span>{activeNotice}</span>
        </div>
      )}

      {/* Hero Banner & Restaurant Information Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 sm:p-10 shadow-xl border border-slate-700/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {restaurant.status}
              </span>
              <span className="text-xs text-amber-300/80 font-medium">
                🕒 {restaurant.opening_hours}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-amber-50">
              {restaurant.name}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-light">
              {restaurant.tagline}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>📍 {restaurant.address}</span>
              <span>📞 {restaurant.phone}</span>
            </div>
          </div>

          {/* Quick Action Button & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu or orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 bg-slate-800/90 border border-slate-700 text-white text-sm rounded-xl placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
              <span className="absolute right-3 top-2.5 text-slate-400">🔍</span>
            </div>

            <button
              onClick={() => handleAddToCart('Quick Table Item')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-orange-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>⚡</span> New POS Order ({cartItemsCount})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Dashboard Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Today's Revenue</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">💰</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{stats.today_revenue.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">↑ +14.2% vs yesterday</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Orders</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">🛍️</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.active_orders} <span className="text-xs text-slate-400 font-normal">/ {stats.total_orders} total</span>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-1">12 serving live</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Table Occupancy</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">🪑</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.occupied_tables} <span className="text-xs text-slate-400 font-normal">/ {stats.total_tables} tables</span>
          </div>
          <p className="text-xs text-amber-600 font-medium mt-1">60% Occupied floor</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Kitchen Queue</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">🔥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.pending_kitchen} <span className="text-xs text-slate-400 font-normal">orders</span>
          </div>
          <p className="text-xs text-rose-600 font-medium mt-1">Avg prep time ~16m</p>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🍕</span> Menu & Chef Specials
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'tables'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🪑</span> Floor Tables ({tables.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>📋</span> Live Orders ({recentOrders.length})
          </button>
        </div>

        <button
          onClick={fetchRestaurantData}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>🔄</span> Refresh API
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="py-16 text-center text-slate-500">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-medium">Loading Restaurant Homepage API data...</p>
        </div>
      )}

      {!loading && error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchRestaurantData} className="underline font-semibold">Retry</button>
        </div>
      )}

      {/* TAB 1: MENU & CHEF SPECIALS */}
      {!loading && !error && activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Items ({featuredDishes.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span> {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {dish.is_chef_special && (
                      <span className="px-2.5 py-1 bg-amber-500/95 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-md backdrop-blur-sm">
                        ⭐ Chef Special
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-slate-900/80 text-white font-medium text-[10px] rounded-lg backdrop-blur-sm">
                      {dish.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-slate-800 shadow">
                    ⏱️ {dish.prep_time}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition">
                        {dish.name}
                      </h3>
                      <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                        ★ {dish.rating}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 block">Price</span>
                      <span className="text-xl font-black text-slate-900">₹{dish.price}</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(dish.name)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>+ Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FLOOR TABLES MAP */}
      {!loading && !error && activeTab === 'tables' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Live Restaurant Floor Plan</h2>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Occupied</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Reserved</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Cleaning</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tables.map((t, idx) => {
              const statusColors = {
                Available: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400',
                Occupied: 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-400',
                Reserved: 'bg-blue-50 text-blue-900 border-blue-200 hover:border-blue-400',
                Cleaning: 'bg-purple-50 text-purple-900 border-purple-200 hover:border-purple-400',
              }

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveNotice(`Selected Table ${t.table_no} (${t.status})`)
                    setTimeout(() => setActiveNotice(''), 2500)
                  }}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between h-36 ${
                    statusColors[t.status] || 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xl">{t.table_no}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 font-semibold shadow-xs">
                      👥 {t.capacity} seats
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold">{t.status}</div>
                    {t.status === 'Occupied' && (
                      <p className="text-xs opacity-75 mt-0.5">
                        {t.guest_count} guests • {t.order_id} ({t.time_seated})
                      </p>
                    )}
                    {t.status === 'Reserved' && (
                      <p className="text-xs opacity-75 mt-0.5">{t.time_seated}</p>
                    )}
                    {t.status === 'Available' && (
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">Ready for guests</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE ORDERS FEED */}
      {!loading && !error && activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Recent & Live Orders</h2>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900 text-base">{ord.id}</span>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                        {ord.table}
                      </span>
                      <span className="text-xs text-slate-400">• {ord.time}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Customer: <span className="font-normal text-slate-600">{ord.customer}</span>
                    </p>
                    <p className="text-xs text-slate-500">Items: {ord.items}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Bill</span>
                      <span className="text-lg font-black text-slate-900">₹{ord.total}</span>
                    </div>

                    <span
                      className={`px-3 py-1.5 text-xs font-extrabold rounded-xl ${
                        ord.status === 'Preparing'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : ord.status === 'Ready'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : ord.status === 'Served'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home
