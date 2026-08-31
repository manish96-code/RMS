import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import KitchenColumn from '../../components/kitchen/KitchenColumn'
import AdminSidebar from '../../components/AdminSidebar'
import { kitchenService } from '../../services/kitchenService'
import { useAuth } from '../../context/AuthContext'

const KitchenDashboard = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)

  const previousPendingCount = useRef(0)

  // Fetch kitchen orders
  const fetchKitchenOrders = async (isManual = false) => {
    if (isManual) setLoading(true)
    const res = await kitchenService.getKitchenOrders()
    if (res.ok && res.data?.success) {
      const fetchedOrders = res.data.data || []
      setOrders(fetchedOrders)
      setLastRefreshed(new Date())

      // Check if new pending orders arrived to trigger alert
      const currentPendingCount = fetchedOrders.filter((o) => o.status === 'pending').length
      if (currentPendingCount > previousPendingCount.current && previousPendingCount.current !== 0) {
        toast('🔔 New Kitchen Order Ticket Arrived!', {
          icon: '👨‍🍳',
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            fontWeight: 'bold',
          },
        })
      }
      previousPendingCount.current = currentPendingCount
    } else {
      if (isManual) toast.error(res.data?.message || 'Failed to refresh kitchen orders.')
    }
    setLoading(false)
  }

  // Initial load and 10-second polling interval
  useEffect(() => {
    fetchKitchenOrders(true)

    const timer = setInterval(() => {
      if (autoRefreshEnabled) {
        fetchKitchenOrders(false)
      }
    }, 10000)

    return () => clearInterval(timer)
  }, [autoRefreshEnabled])

  // Mark Order as Preparing (pending -> preparing)
  const handleMarkPreparing = async (orderId) => {
    setUpdatingOrderId(orderId)
    const res = await kitchenService.markOrderPreparing(orderId)
    if (res.ok && res.data?.success) {
      toast.success('Order marked as preparing!')
      fetchKitchenOrders(false)
    } else {
      toast.error(res.data?.message || 'This order cannot be moved to preparing.')
    }
    setUpdatingOrderId(null)
  }

  // Mark Order as Ready (preparing -> ready)
  const handleMarkReady = async (orderId) => {
    setUpdatingOrderId(orderId)
    const res = await kitchenService.markOrderReady(orderId)
    if (res.ok && res.data?.success) {
      toast.success('Order marked as READY for service!')
      fetchKitchenOrders(false)
    } else {
      toast.error(res.data?.message || 'This order cannot be moved to ready.')
    }
    setUpdatingOrderId(null)
  }

  // Categorize orders into stage columns
  const pendingOrders = orders.filter((o) => o.status === 'pending')
  const preparingOrders = orders.filter((o) => o.status === 'preparing')
  const readyOrders = orders.filter((o) => o.status === 'ready')

  const isAdmin = user?.role === 'admin'
  const backLink = isAdmin ? '/admin/dashboard' : '/staff/dashboard'

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      {/* Sidebar for Admin users */}
      {isAdmin && <AdminSidebar />}

      {/* Main Viewport Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Header (Standardized with all Admin Pages) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kitchen & KOT Management</span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
              <span>👨‍🍳</span> Kitchen Display System (KDS)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time Kitchen Order Tickets ({orders.length} active orders)
            </p>
          </div>

          {/* Action Toolbar & Timers */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            {/* Auto-Refresh Toggle */}
            <button
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              className={`px-3.5 py-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                autoRefreshEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-bold'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle automatic 10-second background polling"
            >
              <span>{autoRefreshEnabled ? '🟢 Auto-Sync ON (10s)' : '⏸️ Auto-Sync PAUSED'}</span>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchKitchenOrders(true)}
              disabled={loading}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-2xs"
            >
              <span>🔄</span> Refresh
            </button>

            {/* Last Updated Timestamp */}
            <span className="text-[11px] text-slate-500 font-medium hidden md:inline-block">
              Updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Main Kanban Content Viewport */}
        {loading && orders.length === 0 ? (
          <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
            <span className="text-4xl block animate-bounce">🍳</span>
            <h3 className="text-sm font-bold text-slate-800">Loading Kitchen Order Tickets...</h3>
            <p className="text-xs text-slate-500">Connecting to restaurant kitchen server</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-220px)]">
            {/* 1. Pending Column */}
            <KitchenColumn
              title="Pending Orders"
              subtitle="New incoming tickets"
              icon="⏱️"
              type="pending"
              orders={pendingOrders}
              onMarkPreparing={handleMarkPreparing}
              onMarkReady={handleMarkReady}
              updatingOrderId={updatingOrderId}
            />

            {/* 2. Preparing Column */}
            <KitchenColumn
              title="Preparing"
              subtitle="Currently cooking on stove"
              icon="🔥"
              type="preparing"
              orders={preparingOrders}
              onMarkPreparing={handleMarkPreparing}
              onMarkReady={handleMarkReady}
              updatingOrderId={updatingOrderId}
            />

            {/* 3. Ready Column */}
            <KitchenColumn
              title="Ready for Service"
              subtitle="Waiting for staff pickup"
              icon="🟢"
              type="ready"
              orders={readyOrders}
              onMarkPreparing={handleMarkPreparing}
              onMarkReady={handleMarkReady}
              updatingOrderId={updatingOrderId}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default KitchenDashboard
