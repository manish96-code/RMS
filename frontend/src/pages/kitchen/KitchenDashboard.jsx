import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import KitchenColumn from '../../components/kitchen/KitchenColumn'
import { kitchenService } from '../../services/kitchenService'
import { useAuth } from '../../context/AuthContext'

const KitchenDashboard = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

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

  const backLink = user?.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard'

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased flex flex-col justify-between">
      {/* Top Bar Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Brand & Page Info */}
          <div className="flex items-center gap-3">
            <Link
              to={backLink}
              className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center transition cursor-pointer"
              title="Return to Dashboard"
            >
              ←
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>👨‍🍳</span> Kitchen Display System (KDS)
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Real-time Kitchen Order Tickets ({orders.length} active orders)
              </p>
            </div>
          </div>

          {/* Action Toolbar & Timers */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            {/* Auto-Refresh Toggle */}
            <button
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                autoRefreshEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle automatic 10-second background polling"
            >
              <span>{autoRefreshEnabled ? '🟢 Auto-Sync ON (10s)' : '⏸️ Auto-Sync PAUSED'}</span>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchKitchenOrders(true)}
              disabled={loading}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>🔄</span> Refresh
            </button>

            {/* Last Updated Timestamp */}
            <span className="text-[11px] text-slate-400 font-normal hidden md:inline-block">
              Updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </header>

      {/* Main Kanban Content Viewport */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {loading && orders.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <span className="text-4xl block animate-bounce">🍳</span>
            <h3 className="text-sm font-bold text-slate-300">Loading Kitchen Order Tickets...</h3>
            <p className="text-xs text-slate-500">Connecting to restaurant kitchen server</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]">
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
