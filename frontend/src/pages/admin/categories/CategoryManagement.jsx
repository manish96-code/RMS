import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../../components/AdminSidebar'
import CategoryForm from '../../../components/menu/CategoryForm'
import { categoryService } from '../../../services/categoryService'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryData, setCategoryData] = useState({ name: '', description: '', status: 'active' })
  const [categoryErrors, setCategoryErrors] = useState({})
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false)

  // Delete Category Confirmation Modal State
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true)
    const res = await categoryService.getCategories()
    if (res.ok && res.data?.success) {
      setCategories(res.data.data || [])
    } else {
      toast.error(res.data?.message || 'Failed to fetch categories.')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Open modal to add category
  const handleOpenAddModal = () => {
    setEditingCategory(null)
    setCategoryData({ name: '', description: '', status: 'active' })
    setCategoryErrors({})
    setShowCategoryModal(true)
  }

  // Open modal to edit category
  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat)
    setCategoryData({
      name: cat.name || '',
      description: cat.description || '',
      status: cat.status || 'active',
    })
    setCategoryErrors({})
    setShowCategoryModal(true)
  }

  // Form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setCategoryData((prev) => ({ ...prev, [name]: value }))
    if (categoryErrors[name]) {
      setCategoryErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Submit Category Form (Create or Update)
  const handleCategorySubmit = async (e) => {
    if (e) e.preventDefault()
    setIsSubmittingCategory(true)
    setCategoryErrors({})

    let res
    if (editingCategory) {
      res = await categoryService.updateCategory(editingCategory.id, categoryData)
    } else {
      res = await categoryService.createCategory(categoryData)
    }

    if (res.ok && res.data?.success) {
      toast.success(
        editingCategory
          ? 'Category updated successfully!'
          : 'New food category created successfully!'
      )
      setShowCategoryModal(false)
      fetchCategories()
    } else {
      if (res.data?.errors) {
        setCategoryErrors(res.data.errors)
      } else {
        toast.error(res.data?.message || 'Failed to save category.')
      }
    }
    setIsSubmittingCategory(false)
  }

  // Confirm delete category
  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return
    setIsDeleting(true)
    const res = await categoryService.deleteCategory(deletingCategory.id)
    if (res.ok && res.data?.success) {
      toast.success('Category deleted successfully!')
      setDeletingCategory(null)
      fetchCategories()
    } else {
      toast.error(res.data?.message || 'Failed to delete category.')
    }
    setIsDeleting(false)
  }

  // Filtered categories list
  const filteredCategories = categories.filter((cat) => {
    if (statusFilter && cat.status !== statusFilter) return false
    if (
      searchQuery &&
      !cat.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  // Summary Metrics
  const totalCategoriesCount = categories.length
  const activeCategoriesCount = categories.filter((c) => c.status === 'active').length
  const inactiveCategoriesCount = categories.filter((c) => c.status === 'inactive').length
  const totalDishesCount = categories.reduce(
    (sum, c) => sum + (c.menu_items_count || (c.menu_items ? c.menu_items.length : 0)),
    0
  )

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      <AdminSidebar />

      {/* Resizable Slide-Over Category Drawer Modal */}
      {showCategoryModal && (
        <CategoryForm
          categoryData={categoryData}
          fieldErrors={categoryErrors}
          onChange={handleFormChange}
          onSubmit={handleCategorySubmit}
          onClose={() => setShowCategoryModal(false)}
          isEditing={!!editingCategory}
          isSubmitting={isSubmittingCategory}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl border border-slate-200">
            <span className="text-4xl block">🗑️</span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Delete Category?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete{' '}
                <strong className="text-slate-800">"{deletingCategory.name}"</strong>? Dishes linked
                to this category may become uncategorized.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingCategory(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Content */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>📁</span> Category Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize food dishes, set active availability, and structure your menu catalog
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>+</span> Add New Category
          </button>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Categories
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {totalCategoriesCount}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
              Active Categories
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              {activeCategoriesCount}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider block">
              Inactive Categories
            </span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">
              {inactiveCategoriesCount}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Menu Items
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {totalDishesCount}
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80 relative">
            <input
              type="text"
              placeholder="Search category name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 transition"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl focus:outline-none focus:border-slate-800 transition font-medium"
            >
              <option value="">All Category Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Categories Roster Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs p-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs font-semibold">
              Loading category directory...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <span className="text-4xl block">📁</span>
              <h3 className="text-sm font-bold text-slate-700">No Food Categories Found</h3>
              <p className="text-xs text-slate-400">
                Click "+ Add New Category" to create your first food category.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                  <tr>
                    <th className="px-4 py-3.5 w-16">ID</th>
                    <th className="px-4 py-3.5">Category Name</th>
                    <th className="px-4 py-3.5">Description</th>
                    <th className="px-4 py-3.5">Dishes Linked</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredCategories.map((cat) => {
                    const isActive = cat.status === 'active'
                    const itemsCount =
                      cat.menu_items_count !== undefined
                        ? cat.menu_items_count
                        : cat.menu_items
                        ? cat.menu_items.length
                        : 0

                    return (
                      <tr key={cat.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3.5 font-bold text-slate-400">#{cat.id}</td>

                        {/* Category Name */}
                        <td className="px-4 py-3.5">
                          <div className="font-extrabold text-slate-900 text-sm capitalize flex items-center gap-2">
                            <span>📁</span> {cat.name}
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-4 py-3.5">
                          {cat.description ? (
                            <span className="text-slate-600 font-medium line-clamp-1 max-w-sm">
                              {cat.description}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">No description</span>
                          )}
                        </td>

                        {/* Linked Items Count Badge */}
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-lg text-xs inline-block">
                            {itemsCount} {itemsCount === 1 ? 'Dish' : 'Dishes'}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {isActive ? '🟢 Active' : '🔴 Inactive'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(cat)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => setDeletingCategory(cat)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition cursor-pointer border border-rose-200"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default CategoryManagement
