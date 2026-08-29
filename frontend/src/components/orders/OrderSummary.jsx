import React from 'react'

const OrderSummary = ({
  selectedTable,
  cartItems,
  generalNotes,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = Math.round(subtotal * 0.05 * 100) / 100
  const total = subtotal + tax

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl p-6 space-y-5 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Confirm Food Order</h3>
            <p className="text-xs text-slate-500">Please review items and pricing before placing order</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Table & Order Info Header */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Table</span>
            <span className="text-sm font-extrabold text-slate-900">{selectedTable?.table_number}</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Mode</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Dine In
            </span>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Order Items</h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {cartItems.map((item) => (
              <div key={item.menu_item_id} className="p-3 flex items-center justify-between bg-white">
                <div>
                  <span className="font-bold text-slate-900">{item.quantity} × {item.name}</span>
                  {item.notes && (
                    <p className="text-[11px] text-amber-800 font-medium mt-0.5">Note: {item.notes}</p>
                  )}
                </div>
                <span className="font-extrabold text-slate-900">₹{item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* General Customer Notes */}
        {generalNotes && (
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
            <span className="font-bold">Customer Notes: </span>
            <span>{generalNotes}</span>
          </div>
        )}

        {/* Totals Breakdown */}
        <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600 font-medium">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span className="font-bold text-slate-900">₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
            <span>Total Payable</span>
            <span className="text-base text-slate-900">₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
          >
            ← Back to Menu
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Placing Order...</span>
              </>
            ) : (
              <span>Confirm & Place Order →</span>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

export default OrderSummary
