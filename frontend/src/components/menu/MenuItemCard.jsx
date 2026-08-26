import React from 'react'

const MenuItemCard = ({
  item,
  onToggleAvailability,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const isAvailable = !!item.is_available

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between text-left">
      
      {/* Image & Badges Banner */}
      <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className="text-center p-4">
            <span className="text-4xl block">🍲</span>
          </div>
        )}

        {/* Category Pill Badge */}
        {item.category_name && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-slate-800 font-bold text-[10px] rounded-lg shadow-2xs uppercase tracking-wider">
            {item.category_name}
          </span>
        )}

        {/* Availability Status Badge */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-2xs backdrop-blur-xs ${
            isAvailable
              ? 'bg-emerald-500/90 text-white'
              : 'bg-rose-500/90 text-white'
          }`}
        >
          {isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>

      {/* Item Body Info */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight leading-snug">
              {item.name}
            </h3>
            <span className="font-extrabold text-slate-900 text-sm shrink-0">
              ₹{Number(item.price).toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">
            {item.description || 'No description provided.'}
          </p>
        </div>

        {/* Admin Action Bar */}
        {isAdmin && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-semibold">
            {/* Availability Toggle Button */}
            <button
              onClick={() => onToggleAvailability(item)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                isAvailable
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              {isAvailable ? '🟢 Available' : '🔴 Unavailable'}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(item)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition cursor-pointer"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(item)}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs transition cursor-pointer"
              >
                🗑️
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default MenuItemCard
