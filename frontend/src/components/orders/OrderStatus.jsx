import React from 'react'

const OrderStatus = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: '⏳' },
    preparing: { label: 'Preparing', bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: '👨‍🍳' },
    ready: { label: 'Ready', bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: '🔔' },
    served: { label: 'Served', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: '🍽️' },
    completed: { label: 'Completed', bg: 'bg-slate-900 text-white border-slate-900', icon: '✅' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-50 text-rose-800 border-rose-200', icon: '❌' },
  }

  const current = statusConfig[status] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: '●',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-2xs ${current.bg}`}
    >
      <span>{current.icon}</span>
      <span>{current.label}</span>
    </span>
  )
}

export default OrderStatus
