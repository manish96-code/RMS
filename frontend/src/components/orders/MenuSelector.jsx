import React, { useState } from 'react'

const MenuSelector = ({
  categories,
  menuItems,
  onAddToCart,
}) => {
  const [selectedCatId, setSelectedCatId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const availableItems = menuItems.filter((item) => {
    if (!item.is_available) return false
    if (selectedCatId && String(item.category_id) !== String(selectedCatId)) return false
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 text-left">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Food Menu Catalog</h2>
          <p className="text-[11px] text-slate-500">Select dishes to add to the order</p>
        </div>

        <input
          type="text"
          placeholder="Search food items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-60 px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCatId('')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            selectedCatId === ''
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedCatId === cat.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {availableItems.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No available food items matching filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {availableItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-xs leading-snug">{item.name}</h3>
                  <span className="font-extrabold text-xs text-slate-900 shrink-0">
                    ₹{Number(item.price).toFixed(2)}
                  </span>
                </div>
                {item.category_name && (
                  <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.category_name}
                  </span>
                )}
                {item.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2">{item.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => onAddToCart(item)}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>+</span> Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuSelector
