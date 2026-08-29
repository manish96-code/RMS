import React, { useState } from 'react'

const MenuItemForm = ({
  itemData,
  categories,
  fieldErrors,
  onChange,
  onImageChange,
  onSubmit,
  onClose,
  isEditing = false,
  isSubmitting = false,
}) => {
  const [imagePreview, setImagePreview] = useState(itemData.image_url || '')

  const handleLocalImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      const localUrl = URL.createObjectURL(file)
      setImagePreview(localUrl)
      if (onImageChange) onImageChange(file)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      {/* Right-Side Stretchable Slide-Over Drawer Modal */}
      <div className="bg-white h-full max-w-lg w-full border-l border-slate-200 shadow-2xl flex flex-col justify-between text-left overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {isEditing ? 'Edit Menu Food Item' : 'Add New Food Item'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Configure pricing, category and food item details</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* Drawer Form Body */}
        <form onSubmit={onSubmit} noValidate className="p-6 space-y-5 text-xs font-medium flex-1">
          
          {/* Food Item Name */}
          <div>
            <label htmlFor="food_name" className="block font-semibold text-slate-700 mb-1">
              Food Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="food_name"
              name="name"
              value={itemData.name || ''}
              onChange={onChange}
              placeholder="e.g. Paneer Butter Masala, Chicken Biryani"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                fieldErrors.name
                  ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
              }`}
            />
            {fieldErrors.name && (
              <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                ⚠️ {fieldErrors.name}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div>
              <label htmlFor="food_cat" className="block font-semibold text-slate-700 mb-1">
                Food Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="food_cat"
                name="category_id"
                value={itemData.category_id || ''}
                onChange={onChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                  fieldErrors.category_id
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                }`}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {fieldErrors.category_id && (
                <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                  ⚠️ {fieldErrors.category_id}
                </span>
              )}
            </div>

            {/* Price (INR) */}
            <div>
              <label htmlFor="food_price" className="block font-semibold text-slate-700 mb-1">
                Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="food_price"
                name="price"
                value={itemData.price || ''}
                onChange={onChange}
                placeholder="250.00"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                  fieldErrors.price
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                }`}
              />
              {fieldErrors.price && (
                <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                  ⚠️ {fieldErrors.price}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="food_desc" className="block font-semibold text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="food_desc"
              name="description"
              rows="3"
              value={itemData.description || ''}
              onChange={onChange}
              placeholder="Ingredients, preparation highlights or portion details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
            />
          </div>

          {/* Food Image Upload & Preview */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Food Image (Optional)</label>
            <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🍲</span>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleLocalImage}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">JPG, PNG or WEBP. Max 2MB.</p>
              </div>
            </div>
            {fieldErrors.image && (
              <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                ⚠️ {fieldErrors.image}
              </span>
            )}
          </div>

          {/* Availability Switch */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <span className="block font-bold text-slate-800 text-xs">Item Availability</span>
              <span className="text-[11px] text-slate-500">Uncheck if dish is out of stock today</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_available"
                checked={!!itemData.is_available}
                onChange={(e) =>
                  onChange({ target: { name: 'is_available', value: e.target.checked } })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

        </form>

        {/* Drawer Action Controls Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-60 shadow-xs"
          >
            {isSubmitting ? 'Saving Food Item...' : isEditing ? 'Update Food Item' : 'Save Food Item'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default MenuItemForm
