import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    prep_time: '15 mins',
    description: '',
    image: '',
  })

  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dishes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then((data) => {
        const dish = data.dish || data.data || data
        if (dish) {
          setFormData({
            name: dish.name || '',
            category: dish.category || 'Main Course',
            price: dish.price !== undefined ? dish.price : '',
            prep_time: dish.prep_time || '15 mins',
            description: dish.description || '',
            image: dish.image || '',
          })
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching dish details:', err)
        setStatus({ type: 'error', message: 'Failed to fetch product details.' })
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/api/dishes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          prep_time: formData.prep_time,
          description: formData.description,
          image: formData.image || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: 'success',
          message: data.message || `Product "${formData.name}" updated successfully!`,
        })
        setTimeout(() => {
          navigate('/admin/products')
        }, 1500)
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Failed to update product.',
        })
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Unable to connect to server.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased text-left font-sans">
      <AdminSidebar />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Product / Dish</h1>
            <p className="text-xs text-slate-500 mt-0.5">Update item details for Product ID: #{id}</p>
          </div>

          <Link
            to="/admin/products"
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg transition"
          >
            ← Back to Products
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading product details...</p>
          </div>
        ) : (
          <>
            {/* Status Alert */}
            {status.message && (
              <div
                className={`p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
                  status.type === 'error'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                <span>{status.message}</span>
              </div>
            )}

            {/* Edit Form */}
            <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label htmlFor="name" className="block font-semibold text-slate-700 mb-1">
                    Product / Dish Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Special Butter Chicken"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block font-semibold text-slate-700 mb-1">
                      Food Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Pizzas & Burgers">Pizzas & Burgers</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price" className="block font-semibold text-slate-700 mb-1">
                      Price (₹) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="380"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prep_time" className="block font-semibold text-slate-700 mb-1">
                      Preparation Time
                    </label>
                    <input
                      type="text"
                      id="prep_time"
                      name="prep_time"
                      value={formData.prep_time}
                      onChange={handleChange}
                      placeholder="e.g. 18 mins"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block font-semibold text-slate-700 mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/food.jpg"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block font-semibold text-slate-700 mb-1">
                    Item Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed ingredients..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? 'Updating Product...' : 'Update Product'}
                  </button>
                  <Link
                    to="/admin/products"
                    className="py-2.5 px-4 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold text-xs rounded-lg transition"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default EditProduct
