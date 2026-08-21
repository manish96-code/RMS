import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const ManageProducts = () => {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [toastMessage, setToastMessage] = useState('')

  const fetchDishes = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/api/dishes`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products')
        return res.json()
      })
      .then((data) => {
        setDishes(data.dishes || data.data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching dishes:', err)
        setError('Failed to fetch dishes. Check backend server connection.')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDishes()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/dishes/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setDishes((prev) => prev.filter((d) => d.id !== id))
        showToast(`Deleted "${name}" from menu.`)
      } else {
        alert('Failed to delete product.')
      }
    } catch {
      alert('Unable to connect to server.')
    }
  }

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = categoryFilter === 'All' || dish.category === categoryFilter
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased text-left font-sans">
      
      {/* Shared Admin Sidebar */}
      <AdminSidebar dishesCount={dishes.length} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-md flex items-center gap-2 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Manage Products & Menu</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              View, edit, filter and manage live dishes in the restaurant menu ({dishes.length} items)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/add-product"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
            >
              <span>+</span> Add Product
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 overflow-x-auto">
            {['All', 'Starters', 'Main Course', 'Pizzas & Burgers', 'Desserts', 'Beverages'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-56 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg focus:outline-none focus:border-slate-800 transition"
          />
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading menu products...</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchDishes} className="underline font-semibold">Retry</button>
          </div>
        )}

        {/* Products Table */}
        {!loading && !error && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Prep Time</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDishes.length > 0 ? (
                    filteredDishes.map((dish) => (
                      <tr key={dish.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3.5 font-mono text-slate-400">#{dish.id}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{dish.name}</td>
                        <td className="px-4 py-3.5 text-slate-600">{dish.category}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">₹{dish.price}</td>
                        <td className="px-4 py-3.5 text-slate-500">{dish.prep_time || '15 mins'}</td>
                        <td className="px-4 py-3.5 text-amber-600 font-semibold">★ {dish.rating || 4.8}</td>
                        <td className="px-4 py-3.5 text-right flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/view-product/${dish.id}`}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition"
                          >
                            👁️ View
                          </Link>

                          <Link
                            to={`/admin/edit-product/${dish.id}`}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-semibold transition"
                          >
                            ✏️ Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(dish.id, dish.name)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded text-xs font-semibold transition cursor-pointer"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-slate-400 text-xs">
                        No products found matching filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  )
}

export default ManageProducts
