import React from 'react'
import { useNavigate } from 'react-router-dom'

const TableCard = ({
  table,
  onEdit,
  onDelete,
  onToggleStatus,
  isAdmin = false,
}) => {
  const navigate = useNavigate()
  const isAvailable = table.status === 'available'

  const handleCardClick = () => {
    if (!isAdmin) {
      if (isAvailable) {
        // Prepare table selection for Staff Order Creation (Requirement 16)
        navigate(`/staff/orders/create?table_id=${table.id}`)
      }
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className={`rounded-2xl border p-5 shadow-2xs transition flex flex-col justify-between text-left relative overflow-hidden ${
        !isAdmin && isAvailable ? 'cursor-pointer hover:shadow-md hover:scale-[1.01]' : ''
      } ${
        isAvailable
          ? 'bg-white border-emerald-200 hover:border-emerald-300'
          : 'bg-rose-50/40 border-rose-200'
      }`}
    >
      {/* Visual Header Indicator Bar */}
      <div
        className={`h-1.5 absolute top-0 left-0 right-0 ${
          isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      ></div>

      {/* Top Details Header */}
      <div className="flex items-start justify-between gap-2 pt-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Table No.
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {table.table_number}
          </h3>
        </div>

        {/* Status Pill Badge */}
        <span
          className={`px-3 py-1 rounded-xl text-xs font-bold capitalize border shadow-2xs ${
            isAvailable
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-100 text-rose-800 border-rose-300'
          }`}
        >
          {isAvailable ? '🟢 Available' : '🔴 Occupied'}
        </span>
      </div>

      {/* Capacity Seating Info */}
      <div className="my-4 py-3 px-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-600 font-semibold">
        <div className="flex items-center gap-2">
          <span>🪑 Capacity:</span>
          <span className="font-bold text-slate-900 text-sm">{table.capacity} Seats</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">ID: #{table.id}</span>
      </div>

      {/* Admin Operations Bar */}
      {isAdmin ? (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-semibold">
          {/* Quick Status Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleStatus(table)
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
              isAvailable
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isAvailable ? 'Mark Occupied' : 'Mark Available'}
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(table)
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition cursor-pointer"
            >
              ✏️ Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(table)
              }}
              disabled={!isAvailable}
              title={!isAvailable ? 'Occupied table cannot be deleted' : 'Delete table'}
              className={`px-2.5 py-1 rounded-lg text-xs transition ${
                isAvailable
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              🗑️
            </button>
          </div>
        </div>
      ) : (
        /* Staff Action Footer */
        <div className="pt-1 text-[11px] font-bold text-center">
          {isAvailable ? (
            <span className="text-emerald-700 block hover:underline">
              Tap to Select Table for Order →
            </span>
          ) : (
            <span className="text-slate-400 block">Table Seated</span>
          )}
        </div>
      )}
    </div>
  )
}

export default TableCard
