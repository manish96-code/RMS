import React from 'react'
import ResizableDrawer from '../common/ResizableDrawer'

const MenuItemDetailModal = ({
  item,
  onClose,
  onEdit,
  isAdmin = false,
  onAddToOrder,
}) => {
  if (!item) return null

  const isAvailable = !!item.is_available

  return (
    <ResizableDrawer onClose={onClose} initialWidth={480} storageKey="item_detail_drawer_width">
      {/* Drawer Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>🍽️</span> Food Dish Details
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Item ID: #{item.id}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer transition"
        >
          ✕
        </button>
      </div>

      {/* Drawer Content Body */}
      <div className="p-6 space-y-6 text-xs font-medium flex-1 overflow-y-auto">
        {/* Dish Image Banner */}
        <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center group">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-center p-6">
              <span className="text-6xl block mb-2">🍲</span>
              <span className="text-xs font-semibold text-slate-400">No Image Uploaded</span>
            </div>
          )}

          {/* Category Pill Overlay */}
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-slate-800 font-bold text-xs rounded-xl shadow-xs uppercase tracking-wider">
            {item.category_name || item.category?.name || 'Uncategorized'}
          </span>

          {/* Availability Status Badge Overlay */}
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-bold shadow-xs backdrop-blur-md ${
              isAvailable
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            {isAvailable ? '🟢 Available' : '🔴 Out of Stock'}
          </span>
        </div>

        {/* Title & Price Header */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug capitalize">
              {item.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Category: <span className="font-bold text-slate-700">{item.category_name || item.category?.name || 'General'}</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400 font-bold uppercase block">Price</span>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              ₹{Number(item.price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Dish Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Description
          </h4>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 leading-relaxed text-xs shadow-2xs font-normal">
            {item.description ? (
              <p>{item.description}</p>
            ) : (
              <p className="text-slate-400 italic">No detailed description provided for this dish.</p>
            )}
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Dish Specifications
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Item Status</span>
              <span className={`font-bold ${isAvailable ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isAvailable ? 'Active for Orders' : 'Currently Unavailable'}
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Item ID</span>
              <span className="font-bold text-slate-800">#{item.id}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Created Date</span>
              <span className="font-bold text-slate-800">
                {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Updated Date</span>
              <span className="font-bold text-slate-800">
                {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Footer Controls */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-3 sticky bottom-0">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-100 transition cursor-pointer"
        >
          Close
        </button>

        {isAdmin && onEdit && (
          <button
            type="button"
            onClick={() => {
              onClose()
              onEdit(item)
            }}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <span>✏️</span> Edit Food Item
          </button>
        )}

        {!isAdmin && onAddToOrder && (
          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => {
              onAddToOrder(item)
              onClose()
            }}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-xs flex items-center justify-center gap-2"
          >
            <span>🛒</span> Add to Order
          </button>
        )}
      </div>
    </ResizableDrawer>
  )
}

export default MenuItemDetailModal
