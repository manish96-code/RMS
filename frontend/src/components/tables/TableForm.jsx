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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl p-6 space-y-4 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEditing ? 'Edit Restaurant Table' : 'Add New Table'}
            </h3>
            <p className="text-xs text-slate-500">Configure table seating number and guest capacity</p>
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

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Saving Table...' : isEditing ? 'Update Table' : 'Save Table'}
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

export default TableForm
