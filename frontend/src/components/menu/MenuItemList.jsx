import React, { useState } from 'react'
import MenuItemCard from './MenuItemCard'
import MenuItemDetailModal from './MenuItemDetailModal'

const MenuItemList = ({
  items,
  onToggleAvailability,
  onEditItem,
  onDeleteItem,
  isAdmin = false,
  onAddToOrder,
}) => {
  // Default viewMode to 'table' as requested by user ("menu management me items table ke form me dikhao")
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [selectedDetailItem, setSelectedDetailItem] = useState(null)

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
      {/* Item Detail Modal */}
      {selectedDetailItem && (
        <MenuItemDetailModal
          item={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          onEdit={onEditItem}
          isAdmin={isAdmin}
          onAddToOrder={onAddToOrder}
        />
      )}

      {/* View Mode Switcher Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Showing {items.length} food items</span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            <span>📋</span> Table Roster View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            <span>📱</span> Cards Grid View
          </button>
        </div>
      </div>

      {/* Table Mode (Default) */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs p-4">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                <tr>
                  <th className="px-4 py-3.5 w-16">Image</th>
                  <th className="px-4 py-3.5">Food Dish Name</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Availability Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {items.map((item) => {
                  const isAvailable = !!item.is_available

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      {/* Image Thumbnail - Click to View */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedDetailItem(item)}
                          className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shadow-2xs shrink-0 cursor-pointer hover:opacity-80 transition"
                          title="Click to view details"
                        >
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">🍲</span>
                          )}
                        </button>
                      </td>

                      {/* Name & Description - Click to View */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedDetailItem(item)}
                          className="text-left font-extrabold text-slate-900 text-sm leading-snug hover:text-emerald-700 transition cursor-pointer capitalize"
                        >
                          {item.name}
                        </button>
                        {item.description ? (
                          <div className="text-[11px] text-slate-500 font-medium line-clamp-1 max-w-sm mt-0.5">
                            {item.description}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">No description</div>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category_name || item.category?.name || 'Uncategorized'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 font-extrabold text-slate-900 text-sm">
                        ₹{Number(item.price).toFixed(2)}
                      </td>

                      {/* Availability Toggle */}
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <button
                            onClick={() => onToggleAvailability(item)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition shadow-2xs border ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                          </button>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedDetailItem(item)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1"
                            title="View Dish Details Modal"
                          >
                            <span>👁️</span> View
                          </button>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() => onEditItem(item)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => onDeleteItem(item)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition cursor-pointer border border-rose-200"
                              >
                                🗑️ Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onToggleAvailability={onToggleAvailability}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              onView={(viewItem) => setSelectedDetailItem(viewItem)}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuItemList
