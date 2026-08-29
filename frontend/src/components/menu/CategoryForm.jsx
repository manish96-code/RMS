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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      {/* Right-Side Stretchable Slide-Over Drawer */}
      <div className="bg-white h-full max-w-md w-full border-l border-slate-200 shadow-2xl flex flex-col justify-between text-left overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {isEditing ? 'Edit Food Category' : 'Add New Category'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Group related dishes on your restaurant menu</p>
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
              rows="4"
              value={categoryData.description || ''}
              onChange={onChange}
              placeholder="Brief description of items under this category..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
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
            {isSubmitting ? 'Saving Category...' : isEditing ? 'Update Category' : 'Save Category'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CategoryForm
