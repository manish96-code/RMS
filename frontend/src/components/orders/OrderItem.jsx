import React from 'react'

const OrderItem = ({
  item,
  onUpdateQty,
  onUpdateNotes,
  onRemoveItem,
}) => {
  return (
    <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-left">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.name}</h4>
          <span className="text-[11px] text-slate-500 font-semibold">
            ₹{Number(item.price).toFixed(2)} each
          </span>
        </div>
        <span className="font-extrabold text-xs text-slate-900 shrink-0">
          ₹{Number(item.subtotal).toFixed(2)}
        </span>
      </div>

      {/* Quantity Controls & Remove */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => onUpdateQty(item.menu_item_id, item.quantity - 1)}
            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center cursor-pointer"
          >
            -
          </button>
          <span className="w-7 text-center text-xs font-bold text-slate-900">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQty(item.menu_item_id, item.quantity + 1)}
            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center cursor-pointer"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemoveItem(item.menu_item_id)}
          className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
        >
          Remove
        </button>
      </div>

      {/* Item Notes Input (e.g. Less spicy) */}
      <div>
        <input
          type="text"
          placeholder="Special notes (e.g. Less spicy, no onion)..."
          value={item.notes || ''}
          onChange={(e) => onUpdateNotes(item.menu_item_id, e.target.value)}
          className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-800 focus:outline-none focus:border-slate-800"
        />
      </div>
    </div>
  )
}

export default OrderItem
