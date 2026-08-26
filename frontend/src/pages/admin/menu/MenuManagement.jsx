import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../../components/AdminSidebar'
import CategoryList from '../../../components/menu/CategoryList'
import CategoryForm from '../../../components/menu/CategoryForm'
import MenuItemList from '../../../components/menu/MenuItemList'
import MenuItemForm from '../../../components/menu/MenuItemForm'
import { categoryService } from '../../../services/categoryService'
import { menuItemService } from '../../../services/menuItemService'

const MenuManagement = () => {
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryData, setCategoryData] = useState({ name: '', description: '', status: 'active' })
  const [categoryErrors, setCategoryErrors] = useState({})
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false)

  // Food Item Modal State
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [itemData, setItemData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    is_available: true,
  })
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [itemErrors, setItemErrors] = useState({})
  const [isSubmittingItem, setIsSubmittingItem] = useState(false)

  // Fetch Categories & Menu Items
  const fetchData = async () => {
    setLoading(true)

    const [catRes, itemRes] = await Promise.all([
      categoryService.getCategories(),
      menuItemService.getMenuItems({
        category_id: selectedCategory,
        is_available: availabilityFilter,
        search: searchQuery,
      }),
    ])

    if (catRes.ok && catRes.data?.success) {
      setCategories(catRes.data.data || [])
    }

    if (itemRes.ok && itemRes.data?.success) {
      setMenuItems(itemRes.data.data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [selectedCategory, availabilityFilter, searchQuery])

  // Category Modal Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null)
    setCategoryData({ name: '', description: '', status: 'active' })
    setCategoryErrors({})
    setShowCategoryModal(true)
  }

  const handleOpenEditCategory = (category) => {
    setEditingCategory(category)
    setCategoryData({
      name: category.name,
      description: category.description || '',
      status: category.status || 'active',
    })
    setCategoryErrors({})
    setShowCategoryModal(true)
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    setIsSubmittingCategory(true)
    setCategoryErrors({})

    let res
    if (editingCategory) {
      res = await categoryService.updateCategory(editingCategory.id, categoryData)
    } else {
      res = await categoryService.createCategory(categoryData)
    }

    const { ok, data } = res

    if (ok && data.success) {
      toast.success(data.message || 'Category saved successfully!')
      setShowCategoryModal(false)
      fetchData()
    } else {
      if (data.errors) {
        const parsed = {}
        Object.keys(data.errors).forEach((key) => {
          parsed[key] = data.errors[key][0]
        })
        setCategoryErrors(parsed)
      } else {
        toast.error(data.message || 'Failed to save category.')
      }
    }

    setIsSubmittingCategory(false)
  }

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      return
    }

    const { ok, data } = await categoryService.deleteCategory(category.id)

    if (ok && data.success) {
      toast.success(`Category "${category.name}" deleted.`)
      fetchData()
    } else {
      toast.error(data.message || 'Failed to delete category.')
    }
  }

  // Food Item Modal Handlers
  const handleOpenAddItem = () => {
    setEditingItem(null)
    setItemData({
      name: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      description: '',
      price: '',
      is_available: true,
    })
    setSelectedImageFile(null)
    setItemErrors({})
    setShowItemModal(true)
  }

  const handleOpenEditItem = (item) => {
    setEditingItem(item)
    setItemData({
      name: item.name,
      category_id: item.category_id,
      description: item.description || '',
      price: item.price,
      is_available: !!item.is_available,
      image_url: item.image_url,
    })
    setSelectedImageFile(null)
    setItemErrors({})
    setShowItemModal(true)
  }

  const handleItemSubmit = async (e) => {
    e.preventDefault()
    setIsSubmittingItem(true)
    setItemErrors({})

    const formDataPayload = new FormData()
    formDataPayload.append('name', itemData.name)
    formDataPayload.append('category_id', itemData.category_id)
    formDataPayload.append('price', itemData.price)
    formDataPayload.append('description', itemData.description || '')
    formDataPayload.append('is_available', itemData.is_available ? '1' : '0')

    if (selectedImageFile) {
      formDataPayload.append('image', selectedImageFile)
    }

    let res
    if (editingItem) {
      formDataPayload.append('_method', 'PUT')
      res = await menuItemService.updateMenuItem(editingItem.id, formDataPayload)
    } else {
      res = await menuItemService.createMenuItem(formDataPayload)
    }

    const { ok, data } = res

    if (ok && data.success) {
      toast.success(data.message || 'Food item saved successfully!')
      setShowItemModal(false)
      fetchData()
    } else {
      if (data.errors) {
        const parsed = {}
        Object.keys(data.errors).forEach((key) => {
          parsed[key] = data.errors[key][0]
        })
        setItemErrors(parsed)
      } else {
        toast.error(data.message || 'Failed to save food item.')
      }
    }

    setIsSubmittingItem(false)
  }

  const handleToggleAvailability = async (item) => {
    const newStatus = !item.is_available
    const { ok, data } = await menuItemService.updateAvailability(item.id, newStatus)

    if (ok && data.success) {
      toast.success(`"${item.name}" marked as ${newStatus ? 'Available' : 'Unavailable'}`)
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: newStatus } : i))
      )
    } else {
      toast.error('Failed to update availability.')
    }
  }

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete food item "${item.name}"?`)) {
      return
    }

    const { ok, data } = await menuItemService.deleteMenuItem(item.id)

    if (ok && data.success) {
      toast.success(`Food item "${item.name}" deleted.`)
      setMenuItems((prev) => prev.filter((i) => i.id !== item.id))
    } else {
      toast.error(data.message || 'Failed to delete food item.')
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      <AdminSidebar dishesCount={menuItems.length} />

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryForm
          categoryData={categoryData}
          fieldErrors={categoryErrors}
          onChange={(e) => setCategoryData({ ...categoryData, [e.target.name]: e.target.value })}
          onSubmit={handleCategorySubmit}
          onClose={() => setShowCategoryModal(false)}
          isEditing={!!editingCategory}
          isSubmitting={isSubmittingCategory}
        />
      )}

      {/* Food Item Modal */}
      {showItemModal && (
        <MenuItemForm
          itemData={itemData}
          categories={categories}
          fieldErrors={itemErrors}
          onChange={(e) => setItemData({ ...itemData, [e.target.name]: e.target.value })}
          onImageChange={(file) => setSelectedImageFile(file)}
          onSubmit={handleItemSubmit}
          onClose={() => setShowItemModal(false)}
          isEditing={!!editingItem}
          isSubmitting={isSubmittingItem}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Menu Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize food categories, add dishes, set prices, food photos and toggle availability
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddCategory}
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              + Add Category
            </button>

            <button
              onClick={handleOpenAddItem}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
            >
              + Add Food Item
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
          onEditCategory={handleOpenEditCategory}
          onDeleteCategory={handleDeleteCategory}
          isAdmin={true}
        />

        {/* Search & Availability Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search food item by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:border-slate-800 transition font-medium"
            />
          </div>

          {/* Availability Filter Pill Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto text-xs font-semibold">
            <span className="text-slate-400 text-xs font-medium mr-1 hidden lg:inline">Availability:</span>
            <button
              onClick={() => setAvailabilityFilter('')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                availabilityFilter === ''
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setAvailabilityFilter('true')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                availabilityFilter === 'true'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              🟢 Available
            </button>
            <button
              onClick={() => setAvailabilityFilter('false')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                availabilityFilter === 'false'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              🔴 Unavailable
            </button>
          </div>
        </div>

        {/* Loading & Grid List */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading restaurant menu...</p>
          </div>
        ) : (
          <MenuItemList
            items={menuItems}
            onToggleAvailability={handleToggleAvailability}
            onEditItem={handleOpenEditItem}
            onDeleteItem={handleDeleteItem}
            isAdmin={true}
          />
        )}

      </main>
    </div>
  )
}

export default MenuManagement
