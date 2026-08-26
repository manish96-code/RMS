import React from 'react'

const CategoryList = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
  isAdmin = false,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-900">Food Categories</h2>
        <span className="text-xs text-slate-500 font-medium">
          {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {/* All Categories Filter Badge */}
        <button
          onClick={() => onSelectCategory('')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            selectedCategoryId === ''
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <span>All Categories</span>
        </button>

        {/* Categories Badges */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id
          const isActive = cat.status === 'active'

          return (
            <div
              key={cat.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <button
                onClick={() => onSelectCategory(cat.id)}
                className="cursor-pointer flex items-center gap-1.5 focus:outline-none"
              >
                <span className={isActive ? 'text-emerald-500 font-bold' : 'text-slate-400 font-bold'}>
                  {isActive ? '●' : '○'}
                </span>
                <span>{cat.name}</span>
                {cat.menu_items_count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.menu_items_count}
                  </span>
                )}
              </button>

              {isAdmin && (
                <div className="flex items-center gap-1 ml-1 border-l border-slate-300/50 pl-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditCategory(cat)
                    }}
                    title="Edit Category"
                    className="hover:text-blue-400 p-0.5 text-xs transition cursor-pointer"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteCategory(cat)
                    }}
                    title="Delete Category"
                    className="hover:text-rose-400 p-0.5 text-xs transition cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryList
