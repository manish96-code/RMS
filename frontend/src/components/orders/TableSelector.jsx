import React from 'react'

const TableSelector = ({ tables, selectedTableId, onSelectTable }) => {
  const availableTables = tables.filter((t) => t.status === 'available')

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Select Dining Table</h2>
          <p className="text-[11px] text-slate-500">Only available tables can be selected for new orders</p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          {availableTables.length} Available
        </span>
      </div>

      {tables.length === 0 ? (
        <div className="py-6 text-center text-slate-400 text-xs">No tables found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
          {tables.map((tbl) => {
            const isAvailable = tbl.status === 'available'
            const isSelected = String(selectedTableId) === String(tbl.id)

            return (
              <button
                key={tbl.id}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectTable(tbl)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                    : isAvailable
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-rose-50/50 border-rose-200 text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm tracking-tight">{tbl.table_number}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected
                        ? 'bg-emerald-400'
                        : isAvailable
                        ? 'bg-emerald-500'
                        : 'bg-rose-400'
                    }`}
                  ></span>
                </div>
                <span className={`text-[10px] mt-2 font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {tbl.capacity} Seats ({tbl.status})
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TableSelector
