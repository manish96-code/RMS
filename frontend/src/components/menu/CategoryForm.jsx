import React from 'react'

const CategoryForm = ({
  categoryData,
  fieldErrors,
  onChange,
  onSubmit,
  onClose,
  isEditing = false,
  isSubmitting = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-6 space-y-4 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEditing ? 'Edit Food Category' : 'Add New Category'}
            </h3>
            <p className="text-xs text-slate-500">Group related dishes on your restaurant menu</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} noValidate className="space-y-4 text-xs font-medium">
          
          {/* Category Name */}
          <div>
            <label htmlFor="cat_name" className="block font-semibold text-slate-700 mb-1">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="cat_name"
              name="name"
              value={categoryData.name || ''}
              onChange={onChange}
              placeholder="e.g. Main Course, Starters, Beverages"
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

          {/* Description */}
          <div>
            <label htmlFor="cat_desc" className="block font-semibold text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="cat_desc"
              name="description"
              rows="3"
              value={categoryData.description || ''}
              onChange={onChange}
              placeholder="Brief description of items under this category..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="cat_status" className="block font-semibold text-slate-700 mb-1">
              Category Status
            </label>
            <select
              id="cat_status"
              name="status"
              value={categoryData.status || 'active'}
              onChange={onChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
            >
              <option value="active">Active (Visible on menu)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </select>
          </div>

          {/* Controls */}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Saving Category...' : isEditing ? 'Update Category' : 'Save Category'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default CategoryForm
