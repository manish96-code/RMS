import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../../context/AuthContext'
import OrderStatus from '../../../components/orders/OrderStatus'
import { orderService } from '../../../services/orderService'

const StaffOrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchOrder = async () => {
    setLoading(true)
    const { ok, data } = await orderService.getOrder(id)
    if (ok && data.success && data.data) {
      setOrder(data.data)
    } else {
      toast.error('Order not found.')
      navigate('/staff/orders')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true)
    const { ok, data } = await orderService.updateOrderStatus(id, newStatus)

    if (ok && data.success) {
      toast.success(`Order marked as ${newStatus}`)
      setOrder(data.data)
    } else {
      toast.error(data.message || 'Failed to update order status.')
    }

    setIsUpdating(false)
  }

  const handleCancelOrder = async () => {
    if (!window.confirm(`Are you sure you want to cancel order ${order.order_number}?`)) {
      return
    }

    setIsUpdating(true)
    const { ok, data } = await orderService.cancelOrder(id)

    if (ok && data.success) {
      toast.success(`Order ${order.order_number} cancelled.`)
      setOrder(data.data)
    } else {
      toast.error(data.message || 'Failed to cancel order.')
    }

    setIsUpdating(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
              🍽️
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-sm block">Gourmet Haven</span>
              <span className="text-[10px] text-slate-500 font-medium block">Order Details View</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/staff/orders"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              ← Back to Orders List
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

      {/* Main Workspace */}
      <main className="max-w-[1200px] mx-auto p-4 sm:p-6 space-y-6">
        
        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading order details...</p>
          </div>
        ) : !order ? (
          <div className="py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-bold">Order Not Found</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
            
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Order #{order.order_number}
                  </h1>
                  <OrderStatus status={order.status} />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Placed on {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus('served')}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer disabled:opacity-60"
                  >
                    Mark Served
                  </button>
                )}

                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={isUpdating}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl transition cursor-pointer disabled:opacity-60"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {/* Meta Cards: Table & Staff Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Table</span>
                <span className="text-base font-extrabold text-slate-900 block">
                  Table {order.table ? order.table.table_number : 'N/A'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Dine In Order</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Served By Staff</span>
                <span className="text-base font-extrabold text-slate-900 block">
                  {order.staff ? order.staff.name : 'Unknown Staff'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">{order.staff?.email}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Order Items ({order.items?.length || 0})
              </h2>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {order.items?.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-xs">
                        {item.quantity}×
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          ₹{Number(item.price).toFixed(2)} each
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                            Note: {item.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="font-extrabold text-slate-900 text-sm">
                      ₹{Number(item.subtotal).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Notes */}
            {order.notes && (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium space-y-0.5">
                <span className="font-bold block">General Customer Instructions:</span>
                <span>{order.notes}</span>
              </div>
            )}

            {/* Financial Totals */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span className="font-bold text-slate-900">₹{Number(order.tax).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-bold">-₹{Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span>₹{Number(order.total).toFixed(2)}</span>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  )
}

export default StaffOrderDetails
