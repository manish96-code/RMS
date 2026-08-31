import React from 'react'
import KitchenOrderCard from './KitchenOrderCard'

const KitchenColumn = ({
  title,
  subtitle,
  icon,
  type, // 'pending', 'preparing', 'ready'
  orders = [],
  onMarkPreparing,
  onMarkReady,
  updatingOrderId,
}) => {
  // Theme styling based on column type
  const headerStyles = {
    pending: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badgeBg: 'bg-amber-500',
      text: 'text-amber-900',
    },
    preparing: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-600',
      text: 'text-blue-900',
    },
    ready: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600',
      text: 'text-emerald-900',
    },
  }[type]

  return (
    <div className="flex-1 flex flex-col min-w-[300px] bg-slate-100/70 border border-slate-200 rounded-3xl p-4 space-y-4">
      {/* Column Header */}
      <div className={`p-4 rounded-2xl border ${headerStyles.bg} ${headerStyles.border} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{icon}</span>
          <div>
            <h3 className={`text-sm font-extrabold ${headerStyles.text}`}>{title}</h3>
            <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-xl text-xs font-black text-white shadow-2xs ${headerStyles.badgeBg}`}>
          {orders.length}
        </span>
      </div>

      {/* Orders Cards List Container */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {orders.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <span className="text-3xl block">✨</span>
            <h4 className="text-xs font-bold text-slate-700">No {title} Orders</h4>
            <p className="text-[11px] text-slate-400">
              {type === 'pending'
                ? 'All incoming kitchen orders have been processed.'
                : type === 'preparing'
                ? 'No items are currently being cooked.'
                : 'No cooked dishes waiting for pickup.'}
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onMarkPreparing={onMarkPreparing}
              onMarkReady={onMarkReady}
              updatingOrderId={updatingOrderId}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default KitchenColumn
