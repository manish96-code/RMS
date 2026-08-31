import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { billingService } from '../../../services/billingService'
import { useAuth } from '../../../context/AuthContext'

const ReceiptPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReceipt = async () => {
      setLoading(true)
      const res = await billingService.getReceipt(id)
      if (res.ok && res.data?.success) {
        setReceipt(res.data.data)
      } else {
        setError(res.data?.message || 'Failed to load receipt details.')
      }
      setLoading(false)
    }

    fetchReceipt()
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  const backLink = user?.role === 'admin' ? `/admin/orders/${id}` : `/staff/orders/${id}`

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased py-8 px-4 flex flex-col items-center justify-start space-y-6">
      {/* Top Action Header (Hidden during printing) */}
      <div className="w-full max-w-md flex items-center justify-between gap-4 print:hidden">
        <Link
          to={backLink}
          className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition"
        >
          ← Back to Order
        </Link>

        <button
          onClick={handlePrint}
          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
        >
          <span>🖨️</span>
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Main Printable Thermal Receipt Container */}
      {loading ? (
        <div className="w-full max-w-md py-16 bg-white rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-600">
          Loading printable receipt...
        </div>
      ) : error ? (
        <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-rose-200 text-center space-y-3">
          <span className="text-3xl block">⚠️</span>
          <h3 className="text-sm font-bold text-slate-800">{error}</h3>
          <Link to={backLink} className="inline-block text-xs font-bold text-slate-900 underline">
            Return to Order
          </Link>
        </div>
      ) : receipt ? (
        <div className="w-full max-w-md bg-white border border-slate-300 p-6 sm:p-8 shadow-sm rounded-xl font-mono text-xs space-y-4 text-slate-900 print:shadow-none print:border-none print:p-0">
          {/* Header */}
          <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-4">
            <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
              {receipt.restaurant?.name || 'Gourmet Haven'}
            </h2>
            <p className="text-[11px] text-slate-600">
              {receipt.restaurant?.address ? `${receipt.restaurant.address}, ${receipt.restaurant.city || ''}` : 'Fine Dining Restaurant'}
            </p>
            {receipt.restaurant?.phone && <p className="text-[11px] text-slate-600">Ph: {receipt.restaurant.phone}</p>}
            {receipt.restaurant?.gst_number && <p className="text-[11px] text-slate-600">GSTIN: {receipt.restaurant.gst_number}</p>}
          </div>

          {/* Metadata Block */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between">
              <span>Order #:</span>
              <span className="font-bold">{receipt.order_number}</span>
            </div>
            {receipt.payment?.payment_number && (
              <div className="flex justify-between">
                <span>Payment Ref #:</span>
                <span className="font-bold">{receipt.payment.payment_number}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Table:</span>
              <span className="font-bold">Table {receipt.table?.table_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Server:</span>
              <span>{receipt.staff?.name || 'Staff'}</span>
            </div>
            <div className="flex justify-between text-slate-500 pt-1">
              <span>Date:</span>
              <span>
                {receipt.payment?.paid_at
                  ? new Date(receipt.payment.paid_at).toLocaleString()
                  : new Date().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Roster Items List */}
          <div className="space-y-2 border-b border-dashed border-slate-300 pb-4">
            <div className="flex justify-between font-bold text-[10px] uppercase text-slate-500 border-b border-slate-200 pb-1">
              <span>Item Description</span>
              <span>Amount</span>
            </div>

            {receipt.items?.map((item, idx) => (
              <div key={item.id || idx} className="space-y-0.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="capitalize">{item.name}</span>
                  <span>₹{Number(item.subtotal).toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {item.quantity} × ₹{Number(item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Financial Calculation Totals */}
          <div className="space-y-1.5 text-xs border-b border-dashed border-slate-300 pb-4">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{Number(receipt.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (GST 5%)</span>
              <span>₹{Number(receipt.tax).toFixed(2)}</span>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span>-₹{Number(receipt.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-300 pt-2">
              <span>TOTAL PAID</span>
              <span>₹{Number(receipt.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Status Footer */}
          <div className="text-center pt-2 space-y-1">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-extrabold rounded text-[11px] uppercase">
              Paid via {receipt.payment?.payment_method || 'CASH'}
            </div>
            <p className="text-[11px] text-slate-500 font-bold block pt-2">*** Thank You For Dining With Us! ***</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ReceiptPage
