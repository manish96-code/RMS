import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const SAMPLE_IMAGES = [
  {
    name: 'Butter Chicken',
    url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Truffle Pizza',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Blueberry Mocktail',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Chocolate Lava Cake',
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
  },
]

const AddProduct = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    prep_time: '15 mins',
    description: '',
    image: '',
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSelectSampleImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }))
    if (fieldErrors.image) {
      setFieldErrors((prev) => ({ ...prev, image: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFieldErrors({})

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: formData.price !== '' ? parseFloat(formData.price) : '',
          prep_time: formData.prep_time || '15 mins',
          description: formData.description || 'Delicious fresh preparation by our top chef.',
          image: formData.image || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || `Dish "${formData.name}" added successfully!`)
        setFormData({
          name: '',
          category: 'Main Course',
          price: '',
          prep_time: '15 mins',
          description: '',
          image: '',
        })
        setFieldErrors({})
        setTimeout(() => {
          navigate('/admin/products')
        }, 1500)
      } else {
        if (data.errors) {
          const parsedErrors = {}
          Object.keys(data.errors).forEach((key) => {
            parsedErrors[key] = data.errors[key][0]
          })
          setFieldErrors(parsedErrors)
        } else {
          toast.error(data.message || 'Failed to add product. Please check form details.')
        }
      }
    } catch {
      toast.error('Unable to connect to backend server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased font-sans text-left">
      
      {/* Shared Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content (Light Theme) */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-10 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Menu Management
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">Add Dish</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>✨</span> Add New Product
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Publish new culinary creations directly to your digital menu & POS terminals
            </p>
          </div>

          <Link
            to="/admin/products"
            className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-2xs"
          >
            ← View All Products
          </Link>
        </div>

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Clean Light Form Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            
            <form onSubmit={handleSubmit} noValidate className="space-y-5 text-xs font-medium">
              
              {/* Form Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Item Details & Pricing</h2>
                  <p className="text-[11px] text-slate-500">Basic information required for menu display</p>
                </div>
              </div>

              {/* Dish Name */}
              <div>
                <label htmlFor="name" className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <span>🏷️</span> Product / Dish Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Special Butter Chicken"
                  className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none transition ${
                    fieldErrors.name
                      ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800'
                  }`}
                />
                {fieldErrors.name && (
                  <span className="text-rose-600 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                    ⚠️ {fieldErrors.name}
                  </span>
                )}
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span>📁</span> Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none transition cursor-pointer ${
                      fieldErrors.category
                        ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                    }`}
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Pizzas & Burgers">Pizzas & Burgers</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                  {fieldErrors.category && (
                    <span className="text-rose-600 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                      ⚠️ {fieldErrors.category}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span>₹</span> Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 380"
                    className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none transition ${
                      fieldErrors.price
                        ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                    }`}
                  />
                  {fieldErrors.price && (
                    <span className="text-rose-600 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                      ⚠️ {fieldErrors.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Prep Time & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label htmlFor="prep_time" className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span>⏱️</span> Prep Time
                  </label>
                  <input
                    type="text"
                    id="prep_time"
                    name="prep_time"
                    value={formData.prep_time}
                    onChange={handleChange}
                    placeholder="e.g. 15 mins"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <span>🖼️</span> Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
                  />
                </div>
              </div>

              {/* Quick Sample Image Selector */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  ⚡ Quick Sample Image Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_IMAGES.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => handleSelectSampleImage(sample.url)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                        formData.image === sample.url
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>📷</span> {sample.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <label htmlFor="description" className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <span>📝</span> Item Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe secret spices, rich ingredients or taste profile..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
                ></textarea>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Publishing Product...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Publish Product to Menu</span>
                    </>
                  )}
                </button>

                <Link
                  to="/admin/products"
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                >
                  Cancel
                </Link>
              </div>

            </form>
          </div>

          {/* Right Column: Live Menu Card Interactive Preview (Light Mode, 5 Cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-2">
                <span>👁️</span> Live Menu Card Preview
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Realtime Updates
              </span>
            </div>

            {/* Light Mode POS / Menu Card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md transition-all duration-300">
              
              {/* Card Image Cover */}
              <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-200">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.name || 'Product Preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <span className="text-4xl block opacity-40">🍽️</span>
                    <span className="text-xs text-slate-400 font-medium block">
                      No Image Provided (Default Placeholder)
                    </span>
                  </div>
                )}

                {/* Category Badge overlay */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 border border-slate-200 shadow-xs">
                  {formData.category || 'Main Course'}
                </div>

                {/* Prep Time Overlay */}
                <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs flex items-center gap-1">
                  <span>⏱️</span> {formData.prep_time || '15 mins'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 text-left">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                    {formData.name || 'Dish Name Preview'}
                  </h3>
                  <span className="text-lg font-extrabold text-slate-900 shrink-0">
                    ₹{formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {formData.description ||
                    'Add a rich description detailing ingredients, flavor profile, and cooking technique to tempt your customers.'}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    ★ 4.9 <span className="text-slate-400 font-normal">(New)</span>
                  </span>

                  <button
                    type="button"
                    disabled
                    className="px-3.5 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-[11px] opacity-90"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Design Tip Box */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-slate-600 space-y-1 text-left">
              <span className="font-bold text-amber-900 block">💡 Pro Tip for High Sales:</span>
              <p>
                Dishes with high-resolution food images & preparation times get up to 35% higher order rates on POS terminals.
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default AddProduct
