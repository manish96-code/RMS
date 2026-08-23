import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { API_BASE_URL } from '../../config'

const Home = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Interactive State
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('menu') // 'menu', 'tables', 'kitchen'
  
  // POS Order Sidebar State
  const [cart, setCart] = useState([
    { id: 101, name: 'Truffle Mushroom Pizza', price: 480, quantity: 1 },
    { id: 105, name: 'Sparkling Blueberry Mint Mocktail', price: 220, quantity: 2 },
  ])
  const [selectedTable, setSelectedTable] = useState('T-01')
  const [orderType, setOrderType] = useState('Dine-In') // 'Dine-In', 'Takeaway', 'Delivery'
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

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
  const [recentOrders, setRecentOrders] = useState(data?.recent_orders || [])

  useEffect(() => {
    if (data?.recent_orders) {
      setRecentOrders(data.recent_orders)
    }
  }, [data])

  // Filter Dishes by Category and Search
  const filteredDishes = featuredDishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Cart operations
  const handleAddToCart = (dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id)
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { id: dish.id, name: dish.name, price: dish.price, quantity: 1 }]
    })
    showToast(`Added "${dish.name}" to POS Cart!`)
  }

  const handleUpdateQuantity = (dishId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === dishId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const showToast = (msg) => {
    toast.success(msg)
  }

  // Bill Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const gstTax = Math.round(subtotal * 0.05) // 5% GST
  const grandTotal = subtotal + gstTax

  const handleCompleteOrder = () => {
    if (cart.length === 0) return
    setShowCheckoutModal(true)
  }

  const handleConfirmPayment = () => {
    setShowCheckoutModal(false)
    setCart([])
    showToast(`Order processed & billed successfully for ${selectedTable}! 🧾`)
  }

  const handleOrderStatusChange = (orderId, newStatus) => {
    setRecentOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    )
    showToast(`Order ${orderId} updated to "${newStatus}"!`)
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Complete POS Payment</h3>
                <p className="text-xs text-slate-500 mt-0.5">{orderType} • Table {selectedTable}</p>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-slate-700 font-medium">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Grand Total (incl. GST)</span>
                  <span className="text-orange-600">₹{grandTotal}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase text-slate-500">Payment Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2.5 rounded-xl border-2 border-orange-500 bg-orange-50 text-orange-700 font-bold text-xs">
                    💳 Card / UPI
                  </button>
                  <button className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50">
                    💵 Cash
                  </button>
                  <button className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50">
                    🏨 Room Bill
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleConfirmPayment}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition cursor-pointer"
              >
                Confirm & Print Receipt (₹{grandTotal})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner / Restaurant Info Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-extrabold uppercase tracking-wider rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {restaurant.status}
            </span>
            <span className="text-xs text-amber-200/80 font-semibold">
              🕒 {restaurant.opening_hours}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {restaurant.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl">
            {restaurant.tagline} • <span className="text-amber-200/90">{restaurant.address}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('menu')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <span>🍕</span> POS Terminal
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
          >
            <span>🪑</span> Tables Live
          </button>
        </div>
      </div>

      {/* KPI Dashboard Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Today's Sales</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm">💵</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{stats.today_revenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +14.2% today</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Active POS Orders</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl text-sm">🛍️</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.active_orders} <span className="text-xs text-slate-400 font-normal">/ {stats.total_orders} total</span>
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">12 serving live</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Table Occupancy</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl text-sm">🪑</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.occupied_tables} <span className="text-xs text-slate-400 font-normal">/ {stats.total_tables} tables</span>
          </div>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">60% Occupied floor</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Kitchen Queue</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl text-sm">🍳</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.pending_kitchen} <span className="text-xs text-slate-400 font-normal">in queue</span>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">Avg prep ~16 mins</p>
        </div>
      </div>

      {/* Main Split Content: Left 70% (Menu/Tables/KDS) + Right 30% (Live POS Terminal Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 / 12) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Sub-Navigation Tabs & Search */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'menu'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🍕</span> Food Menu
              </button>

              <button
                onClick={() => setActiveTab('tables')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'tables'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🪑</span> Floor Map ({tables.length})
              </button>

              <button
                onClick={() => setActiveTab('kitchen')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'kitchen'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🍳</span> Kitchen KDS ({recentOrders.length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search dish or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:border-orange-500 transition"
              />
            </div>
          </div>

          {/* Loading & Error States */}
          {loading && (
            <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-3"></div>
              <p className="text-xs font-semibold">Loading Restaurant POS Data...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={fetchRestaurantData} className="underline font-bold">Retry</button>
            </div>
          )}

          {/* TAB 1: FOOD MENU GRID */}
          {!loading && !error && activeTab === 'menu' && (
            <div className="space-y-5">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === 'All'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  All Items ({featuredDishes.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat.name
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </button>
                ))}
              </div>

              {/* Food Dishes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredDishes.map((dish) => {
                  const cartItem = cart.find((i) => i.id === dish.id)
                  const currentQty = cartItem ? cartItem.quantity : 0

                  return (
                    <div
                      key={dish.id}
                      className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Banner */}
                        <div className="relative h-40 overflow-hidden bg-slate-100">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                            {dish.is_chef_special && (
                              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-extrabold text-[9px] uppercase rounded-md shadow-xs">
                                ⭐ Chef Special
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-800">
                            ⏱️ {dish.prep_time}
                          </div>
                        </div>

                        {/* Dish Details */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition">
                              {dish.name}
                            </h3>
                            <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              ★ {dish.rating}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                            {dish.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer Price & Add Button */}
                      <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Price</span>
                          <span className="text-lg font-black text-slate-900">₹{dish.price}</span>
                        </div>

                        {currentQty > 0 ? (
                          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-2 py-1">
                            <button
                              onClick={() => handleUpdateQuantity(dish.id, -1)}
                              className="w-6 h-6 rounded-lg bg-white text-orange-600 font-bold text-xs flex items-center justify-center hover:bg-orange-100 shadow-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-extrabold text-orange-700 text-xs w-4 text-center">
                              {currentQty}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(dish.id, 1)}
                              className="w-6 h-6 rounded-lg bg-orange-500 text-white font-bold text-xs flex items-center justify-center hover:bg-orange-600 shadow-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(dish)}
                            className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>+ Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FLOOR TABLE MAP */}
          {!loading && !error && activeTab === 'tables' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Live Restaurant Table Map</h2>
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Occupied</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Reserved</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {tables.map((t, idx) => {
                  const isSelected = selectedTable === t.table_no
                  const statusStyles = {
                    Available: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
                    Occupied: 'bg-amber-50/70 border-amber-200 text-amber-900',
                    Reserved: 'bg-blue-50/70 border-blue-200 text-blue-900',
                    Cleaning: 'bg-purple-50/70 border-purple-200 text-purple-900',
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedTable(t.table_no)
                        showToast(`Selected Table ${t.table_no} for active order`)
                      }}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between h-32 ${
                        statusStyles[t.status] || 'bg-slate-50'
                      } ${isSelected ? 'ring-2 ring-orange-500 border-orange-500 shadow-md' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-lg">{t.table_no}</span>
                        <span className="text-[10px] font-bold bg-white/80 px-2 py-0.5 rounded-md shadow-xs">
                          👥 {t.capacity} seats
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">{t.status}</div>
                        {t.status === 'Occupied' && (
                          <p className="text-[10px] opacity-80 mt-0.5">
                            {t.guest_count} guests • {t.order_id} ({t.time_seated})
                          </p>
                        )}
                        {t.status === 'Available' && (
                          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Ready for POS order</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 3: KITCHEN KDS VIEW */}
          {!loading && !error && activeTab === 'kitchen' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Kitchen Display System (KDS) Live Stream</h2>
              <div className="space-y-3">
                {recentOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900 text-sm">{ord.id}</span>
                        <span className="px-2 py-0.5 bg-slate-100 font-bold text-slate-700 text-xs rounded">
                          {ord.table}
                        </span>
                        <span className="text-xs text-slate-400">• {ord.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        Customer: <span className="font-normal text-slate-600">{ord.customer}</span>
                      </p>
                      <p className="text-xs text-orange-600 font-bold">Items: {ord.items}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-extrabold rounded-lg ${
                          ord.status === 'Preparing'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.status === 'Ready'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ord.status}
                      </span>

                      {ord.status === 'Preparing' && (
                        <button
                          onClick={() => handleOrderStatusChange(ord.id, 'Ready')}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                        >
                          Mark Ready 🔔
                        </button>
                      )}
                      {ord.status === 'Ready' && (
                        <button
                          onClick={() => handleOrderStatusChange(ord.id, 'Served')}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-xs hover:bg-blue-700 transition cursor-pointer"
                        >
                          Mark Served 🍽️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (4 / 12) - Interactive POS Terminal Sidebar */}
        <div className="lg:col-span-4 sticky top-20 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-lg space-y-5 text-left">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span>🛒</span> POS Active Ticket
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Order receipt details</p>
            </div>
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setOrderType('Dine-In')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                  orderType === 'Dine-In' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Dine-In
              </button>
              <button
                onClick={() => setOrderType('Takeaway')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                  orderType === 'Takeaway' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Takeaway
              </button>
            </div>
          </div>

          {/* Table Selector */}
          {orderType === 'Dine-In' && (
            <div className="flex items-center justify-between bg-orange-50/80 p-3 rounded-2xl border border-orange-200/80">
              <span className="text-xs font-bold text-orange-900">Assigned Table:</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-white text-slate-800 text-xs font-bold px-3 py-1 rounded-xl border border-orange-300 focus:outline-none shadow-xs"
              >
                {tables.map((t) => (
                  <option key={t.table_no} value={t.table_no}>
                    {t.table_no} ({t.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Cart Item List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/60"
                >
                  <div className="space-y-0.5 max-w-[150px]">
                    <div className="text-xs font-bold text-slate-800 truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">₹{item.price} each</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 shadow-xs">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="text-xs font-bold text-slate-500 hover:text-orange-600 px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-extrabold text-slate-800 w-3 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="text-xs font-bold text-slate-500 hover:text-orange-600 px-1"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs font-black text-slate-900 w-12 text-right">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No items added yet. Click "+ Add to Cart" on food items to build ticket.
              </div>
            )}
          </div>

          {/* Billing Summary Box */}
          {cart.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-slate-500 font-medium">
                <span>GST Tax (5%)</span>
                <span className="font-bold text-slate-800">₹{gstTax}</span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-orange-600 text-base">₹{grandTotal}</span>
              </div>

              <button
                onClick={handleCompleteOrder}
                className="w-full py-3 mt-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                Checkout & Print Bill (₹{grandTotal})
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default Home
