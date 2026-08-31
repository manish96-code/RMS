import React from 'react'

const KitchenOrderCard = ({
  order,
  onMarkPreparing,
  onMarkReady,
  updatingOrderId,
}) => {
  const isUpdating = updatingOrderId === order.id
  const isPending = order.status === 'pending'
  const isPreparing = order.status === 'preparing'
  const isReady = order.status === 'ready'

  // Format creation time
  const formattedTime = order.created_at
    ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A'

  // Dynamic elapsed timer text
  const getElapsedBadge = () => {
    const mins = order.elapsed_minutes || 0
    if (isPending) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
          <span>⏱️</span> {mins === 0 ? 'Just now' : `${mins} min ago`}
        </span>
      )
    }
    if (isPreparing) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
          <span>🔥</span> Prep: {mins} min
        </span>
      )
    }
    if (isReady) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <span>🟢</span> Ready: {mins} min
        </span>
      )
    }
    return null
  }

  return (
    <div
      className={`bg-white border rounded-2xl p-4 shadow-2xs transition flex flex-col justify-between text-left space-y-4 ${
        isPending
          ? 'border-amber-200 hover:border-amber-400 hover:shadow-md'
          : isPreparing
          ? 'border-blue-200 hover:border-blue-400 hover:shadow-md'
          : 'border-emerald-200 hover:border-emerald-400 hover:shadow-md'
      }`}
    >
      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-sm tracking-tight">
                {order.order_number}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white font-extrabold text-[11px]">
                {order.table?.table_number ? `Table ${order.table.table_number}` : 'N/A'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-3">
              <span>👤 {order.staff?.name || 'Staff'}</span>
              <span>🕒 {formattedTime}</span>
            </div>
          </div>

          {getElapsedBadge()}
        </div>

        {/* Food Items Roster List */}
        <div className="space-y-2.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            KOT Dish Items ({order.items?.length || 0})
          </span>

          <div className="space-y-2">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-extrabold text-slate-900 text-xs capitalize leading-snug">
                      <span className="px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded font-black text-[11px] mr-1.5 inline-block">
                        {item.quantity} ×
                      </span>
                      {item.name}
                    </span>
                  </div>

                  {item.notes && (
                    <div className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg inline-block">
                      ⚠️ Note: {item.notes}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 italic">No items attached</div>
            )}
          </div>

          {/* Order Level Special Notes */}
          {order.notes && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold">
              📝 <span className="font-bold">Order Note:</span> {order.notes}
            </div>
          )}
        </div>
      </div>

      {/* Action Button Footer */}
      <div className="pt-3 border-t border-slate-100">
        {isPending && (
          <button
            onClick={() => onMarkPreparing(order.id)}
            disabled={isUpdating}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-60 shadow-xs flex items-center justify-center gap-2"
          >
            <span>👨‍🍳</span>
            <span>{isUpdating ? 'Updating Status...' : 'Start Preparing'}</span>
          </button>
        )}

        {isPreparing && (
          <button
            onClick={() => onMarkReady(order.id)}
            disabled={isUpdating}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-60 shadow-xs flex items-center justify-center gap-2"
          >
            <span>✅</span>
            <span>{isUpdating ? 'Updating Status...' : 'Mark Order Ready'}</span>
          </button>
        )}

        {isReady && (
          <div className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2">
            <span>🟢</span>
            <span>Order Ready for Pickup / Service</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default KitchenOrderCard
