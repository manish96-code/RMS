import React from 'react'

const TableForm = ({
  tableData,
  fieldErrors,
  onChange,
  onSubmit,
  onClose,
  isEditing = false,
  isSubmitting = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      {/* Right-Side Stretchable Slide-Over Drawer Modal */}
      <div className="bg-white h-full max-w-md w-full border-l border-slate-200 shadow-2xl flex flex-col justify-between text-left overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {isEditing ? 'Edit Restaurant Table' : 'Add New Table'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Configure table seating number and guest capacity</p>
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
          
          {/* Table Number */}
          <div>
            <label htmlFor="tbl_no" className="block font-semibold text-slate-700 mb-1">
              Table Number / Identifier <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="tbl_no"
              name="table_number"
              value={tableData.table_number || ''}
              onChange={onChange}
              placeholder="e.g. T01, T02 or 1, 2"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                fieldErrors.table_number
                  ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
              }`}
            />
            {fieldErrors.table_number && (
              <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                ⚠️ {fieldErrors.table_number}
              </span>
            )}
          </div>

          {/* Seating Capacity */}
          <div>
            <label htmlFor="tbl_cap" className="block font-semibold text-slate-700 mb-1">
              Seating Capacity (Guests) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              id="tbl_cap"
              name="capacity"
              value={tableData.capacity || ''}
              onChange={onChange}
              placeholder="e.g. 2, 4, 6, 8"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                fieldErrors.capacity
                  ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
              }`}
            />
            {fieldErrors.capacity && (
              <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                ⚠️ {fieldErrors.capacity}
              </span>
            )}
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
            {isSubmitting ? 'Saving Table...' : isEditing ? 'Update Table' : 'Save Table'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default TableForm
