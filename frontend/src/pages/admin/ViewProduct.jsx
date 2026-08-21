import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const ViewProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [dish, setDish] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dishes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then((data) => {
        setDish(data.dish || data.data || data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching dish details:', err)
        setError('Failed to load product details.')
        setLoading(false)
      })
  }, [id])

  const handleDelete = async () => {
    if (!dish) return
    if (!window.confirm(`Are you sure you want to delete "${dish.name}" from the menu?`)) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/dishes/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        navigate('/admin/products')
      } else {
        alert('Failed to delete product.')
      }
    } catch {
      alert('Unable to connect to server.')
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased text-left font-sans">
      <AdminSidebar />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Product Information</h1>
            <p className="text-xs text-slate-500 mt-0.5">Detailed view for Product ID: #{id}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/products"
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg transition"
            >
              ← Back to Products
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading product details...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center justify-between">
            <span>{error}</span>
            <Link to="/admin/products" className="underline font-semibold">Return to Products</Link>
          </div>
        )}

        {/* Product Details Content */}
        {!loading && !error && dish && (
          <div className="max-w-3xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-6">
            
            {/* Top Image Preview Banner */}
            <div className="relative h-64 sm:h-72 bg-slate-100 overflow-hidden">
              <img
                src={dish.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg">
                {dish.category}
              </div>
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-xl px-4 py-1.5 rounded-lg shadow-sm">
                ₹{dish.price}
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-6 text-xs">
              
              {/* Name & Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{dish.name}</h2>
                  <p className="text-slate-400 font-mono text-[11px] mt-0.5">Database Record ID: #{dish.id}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold border border-amber-200 rounded-lg text-xs">
                    ★ {dish.rating || 4.8} Customer Rating
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded-lg text-xs">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">Description</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {dish.description || 'Delicious fresh preparation cooked to perfection by our restaurant chef.'}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Prep Time</span>
                  <span className="font-bold text-slate-900 text-sm">{dish.prep_time || '15 mins'}</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Category</span>
                  <span className="font-bold text-slate-900 text-sm">{dish.category}</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Created At</span>
                  <span className="font-semibold text-slate-800">
                    {dish.created_at ? new Date(dish.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Updated At</span>
                  <span className="font-semibold text-slate-800">
                    {dish.updated_at ? new Date(dish.updated_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Link
                  to={`/admin/edit-product/${dish.id}`}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition text-xs flex items-center gap-1.5"
                >
                  ✏️ Edit Product Details
                </Link>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg transition text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  🗑️ Delete Product
                </button>

                <Link
                  to="/admin/products"
                  className="ml-auto px-4 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold rounded-lg transition text-xs"
                >
                  Back to All Products
                </Link>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default ViewProduct
