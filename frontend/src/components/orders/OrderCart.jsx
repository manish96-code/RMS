import React from 'react'
import OrderItem from './OrderItem'

const OrderCart = ({
  selectedTable,
  cartItems,
  generalNotes,
  onUpdateQty,
  onUpdateNotes,
  onRemoveItem,
  onGeneralNotesChange,
  onReviewOrder,
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = Math.round(subtotal * 0.05 * 100) / 100
  const total = subtotal + tax

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 text-left flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Order Cart</h3>
            <p className="text-[11px] text-slate-500">
              Table:{' '}
              <span className="font-extrabold text-slate-900">
                {selectedTable ? selectedTable.table_number : 'None Selected'}
              </span>
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* Cart Item List */}
        {cartItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <span className="text-3xl block mb-1">🛒</span>
            <p className="text-xs font-semibold text-slate-600">Cart is Empty</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select dishes from the menu to add them to this order.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <OrderItem
                key={item.menu_item_id}
                item={item}
                onUpdateQty={onUpdateQty}
                onUpdateNotes={onUpdateNotes}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
        )}

        {/* General Customer Notes Input */}
        {cartItems.length > 0 && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              General Customer Instructions (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Serve hot, customer requested quick service..."
              value={generalNotes}
              onChange={(e) => onGeneralNotesChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>
        )}
      </div>

      {/* Cart Summary & Action Button */}
      {cartItems.length > 0 && (
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="space-y-1.5 text-xs text-slate-600 font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-bold text-slate-900">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-100">
              <span>Total Payable</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedTable || cartItems.length === 0}
            onClick={onReviewOrder}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
          >
            Review & Place Order →
          </button>
        </div>
      )}
    </div>
  )
}

export default OrderCart
