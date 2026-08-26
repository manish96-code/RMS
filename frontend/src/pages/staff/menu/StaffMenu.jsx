import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import CategoryList from '../../../components/menu/CategoryList'
import MenuItemList from '../../../components/menu/MenuItemList'
import { categoryService } from '../../../services/categoryService'
import { menuItemService } from '../../../services/menuItemService'

const StaffMenu = () => {
  const { user, logout } = useAuth()

  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchMenu = async () => {
    setLoading(true)

    const [catRes, itemRes] = await Promise.all([
      categoryService.getCategories(),
      menuItemService.getMenuItems({
        category_id: selectedCategory,
        is_available: availabilityFilter,
        search: searchQuery,
      }),
    ])

    if (catRes.ok && catRes.data?.success) {
      setCategories(catRes.data.data || [])
    }

    if (itemRes.ok && itemRes.data?.success) {
      setMenuItems(itemRes.data.data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchMenu()
  }, [selectedCategory, availabilityFilter, searchQuery])

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
              <span className="text-[10px] text-slate-500 font-medium block">Staff Menu Directory</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/staff/dashboard"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              ← Dashboard
            </Link>

            <Link
              to="/profile"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Profile
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
        
        {/* Page Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Staff Read-Only Access</span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Restaurant Digital Menu Catalog</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse food categories, prices and real-time item availability for customer ordering
            </p>
          </div>

          <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl self-start sm:self-auto">
            🔒 Read-Only Terminal
          </span>
        </div>

        {/* Category Filters */}
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
          isAdmin={false}
        />

        {/* Search & Availability Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search dish by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:border-slate-800 transition font-medium"
            />
          </div>

          {/* Availability Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto text-xs font-semibold">
            <span className="text-slate-400 text-xs font-medium mr-1 hidden sm:inline">Filter Availability:</span>
            <button
              onClick={() => setAvailabilityFilter('')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                availabilityFilter === ''
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setAvailabilityFilter('true')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                availabilityFilter === 'true'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              🟢 Available
            </button>
            <button
              onClick={() => setAvailabilityFilter('false')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                availabilityFilter === 'false'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              🔴 Unavailable
            </button>
          </div>
        </div>

        {/* Loading & Read-Only List */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Fetching menu catalog...</p>
          </div>
        ) : (
          <MenuItemList
            items={menuItems}
            isAdmin={false}
          />
        )}

      </main>

    </div>
  )
}

export default StaffMenu
