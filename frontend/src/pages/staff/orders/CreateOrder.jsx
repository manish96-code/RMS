import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../../context/AuthContext'
import TableSelector from '../../../components/orders/TableSelector'
import MenuSelector from '../../../components/orders/MenuSelector'
import OrderCart from '../../../components/orders/OrderCart'
import OrderSummary from '../../../components/orders/OrderSummary'
import { tableService } from '../../../services/tableService'
import { categoryService } from '../../../services/categoryService'
import { menuItemService } from '../../../services/menuItemService'
import { orderService } from '../../../services/orderService'

const CreateOrder = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { logout } = useAuth()

  const queryTableId = searchParams.get('table_id')

  const [tables, setTables] = useState([])
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedTable, setSelectedTable] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [generalNotes, setGeneralNotes] = useState('')
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch initial setup data
  useEffect(() => {
    const initData = async () => {
      setLoading(true)

      const [tblRes, catRes, itemRes] = await Promise.all([
        tableService.getTables(),
        categoryService.getCategories(),
        menuItemService.getMenuItems({ is_available: true }),
      ])

      let loadedTables = []
      if (tblRes.ok && tblRes.data?.success) {
        loadedTables = tblRes.data.data || []
        setTables(loadedTables)
      }

      if (catRes.ok && catRes.data?.success) {
        setCategories(catRes.data.data || [])
      }

      if (itemRes.ok && itemRes.data?.success) {
        setMenuItems(itemRes.data.data || [])
      }

      // Auto-select table if table_id is provided in URL query string
      if (queryTableId && loadedTables.length > 0) {
        const found = loadedTables.find((t) => String(t.id) === String(queryTableId))
        if (found && found.status === 'available') {
          setSelectedTable(found)
        }
      }

      setLoading(false)
    }

    initData()
  }, [queryTableId])

  // Cart operations
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.menu_item_id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.menu_item_id === item.id
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
            : i
        )
      } else {
        return [
          ...prev,
          {
            menu_item_id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: 1,
            subtotal: Number(item.price),
            notes: '',
          },
        ]
      }
    })
    toast.success(`Added ${item.name} to cart`)
  }

  const handleUpdateQty = (menuItemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(menuItemId)
      return
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.menu_item_id === menuItemId
          ? { ...i, quantity: newQty, subtotal: newQty * i.price }
          : i
      )
    )
  }

  const handleUpdateNotes = (menuItemId, notes) => {
    setCartItems((prev) =>
      prev.map((i) => (i.menu_item_id === menuItemId ? { ...i, notes } : i))
    )
  }

  const handleRemoveItem = (menuItemId) => {
    setCartItems((prev) => prev.filter((i) => i.menu_item_id !== menuItemId))
  }

  // Submit Order to API
  const handleConfirmOrder = async () => {
    if (!selectedTable) {
      toast.error('Please select an available dining table.')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Cart is empty. Please add items to place an order.')
      return
    }

    setIsSubmitting(true)

    const payload = {
      table_id: selectedTable.id,
      items: cartItems.map((i) => ({
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
        notes: i.notes || '',
      })),
      notes: generalNotes || '',
    }

    const { ok, data } = await orderService.createOrder(payload)

    if (ok && data.success && data.data) {
      toast.success(data.message || 'Order placed successfully!')
      setShowSummaryModal(false)
      navigate(`/staff/orders/${data.data.id}`)
    } else {
      toast.error(data.message || 'Failed to place order.')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
              🍽️
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-sm block">Gourmet Haven</span>
              <span className="text-[10px] text-slate-500 font-medium block">Staff Order Terminal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/staff/orders"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              📋 Orders Roster
            </Link>

            <Link
              to="/staff/tables"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              🪑 Seating Map
            </Link>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Confirmation Modal */}
      {showSummaryModal && (
        <OrderSummary
          selectedTable={selectedTable}
          cartItems={cartItems}
          generalNotes={generalNotes}
          onConfirm={handleConfirmOrder}
          onCancel={() => setShowSummaryModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Main Container */}
      <main className="max-w-[1500px] mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Customer Order</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select table, pick food items, set quantities and confirm order placement
            </p>
          </div>

          {selectedTable && (
            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold self-start sm:self-auto shadow-2xs">
              Seated at Table {selectedTable.table_number} ({selectedTable.capacity} Seats)
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading POS Order Terminal...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left 2 Columns: Table Selector + Menu Catalog */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Table Selector */}
              <TableSelector
                tables={tables}
                selectedTableId={selectedTable?.id}
                onSelectTable={(tbl) => setSelectedTable(tbl)}
              />

              {/* Step 2: Menu Selector */}
              <MenuSelector
                categories={categories}
                menuItems={menuItems}
                onAddToCart={handleAddToCart}
              />

            </div>

            {/* Right Column: Order Cart Sidebar */}
            <div className="lg:col-span-1 lg:sticky lg:top-20">
              <OrderCart
                selectedTable={selectedTable}
                cartItems={cartItems}
                generalNotes={generalNotes}
                onUpdateQty={handleUpdateQty}
                onUpdateNotes={handleUpdateNotes}
                onRemoveItem={handleRemoveItem}
                onGeneralNotesChange={(notes) => setGeneralNotes(notes)}
                onReviewOrder={() => setShowSummaryModal(true)}
              />
            </div>

          </div>
        )}

      </main>

    </div>
  )
}

export default CreateOrder
