import React, { useState } from 'react'
import MenuItemCard from './MenuItemCard'

const MenuItemList = ({
  items,
  onToggleAvailability,
  onEditItem,
  onDeleteItem,
  isAdmin = false,
}) => {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-4xl block mb-2">🍽️</span>
        <h3 className="text-sm font-bold text-slate-700">No Food Items Found</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Try clearing your search query or select another food category.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Showing {items.length} food items</span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            📱 Grid View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            📋 Table View
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onToggleAvailability={onToggleAvailability}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs p-4">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Food Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Availability</th>
                  {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {items.map((item) => {
                  const isAvailable = !!item.is_available

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">🍲</span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 font-bold text-slate-900">
                        <div>{item.name}</div>
                        {item.description && (
                          <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">
                            {item.description}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-slate-700 font-semibold">
                        {item.category_name || '-'}
                      </td>

                      <td className="px-4 py-3 font-bold text-slate-900">
                        ₹{Number(item.price).toFixed(2)}
                      </td>

                      <td className="px-4 py-3">
                        {isAdmin ? (
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
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        )}
                      </td>

                      {isAdmin && (
                        <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditItem(item)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => onDeleteItem(item)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuItemList
