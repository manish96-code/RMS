import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../../components/AdminSidebar'
import { billingService } from '../../../services/billingService'
import { useAuth } from '../../../context/AuthContext'

const BillPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [bill, setBill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [processing, setProcessing] = useState(false)

  // Fetch bill data
  const fetchBill = async () => {
    setLoading(true)
    setError(null)
    const res = await billingService.getBill(id)
    if (res.ok && res.data?.success) {
      setBill(res.data.data)
      // If already paid, automatically redirect to receipt
      if (res.data.data?.is_paid) {
        toast('This order is already paid!', { icon: '✅' })
      }
    } else {
      setError(res.data?.message || 'Failed to load order bill details.')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBill()
  }, [id])

  // Handle Payment Submission
  const handleConfirmPayment = async () => {
    setProcessing(true)
    const res = await billingService.completePayment(id, paymentMethod)
    if (res.ok && res.data?.success) {
      toast.success(`Payment Completed! Table ${bill?.table?.table_number || ''} is now available.`)
      setShowConfirmModal(false)
      const receiptPath = user?.role === 'admin' ? `/admin/orders/${id}/receipt` : `/staff/orders/${id}/receipt`
      navigate(receiptPath)
    } else {
      toast.error(res.data?.message || 'Payment processing failed.')
      setShowConfirmModal(false)
    }
    setProcessing(false)
  }

  const backLink = user?.role === 'admin' ? `/admin/orders/${id}` : `/staff/orders/${id}`
  const receiptLink = user?.role === 'admin' ? `/admin/orders/${id}/receipt` : `/staff/orders/${id}/receipt`

  const isAdmin = user?.role === 'admin'

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      {/* Sidebar for Admin users */}
      {isAdmin && <AdminSidebar />}

      <div className="flex-1 flex flex-col justify-between overflow-x-hidden pb-12">
        {/* Top Header Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to={backLink}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
            >
              ←
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
                <span>🧾</span> Customer Order Invoice
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Generate final bill & collect customer payment
              </p>
            </div>
          </div>

          {bill && bill.is_paid && (
            <Link
              to={receiptLink}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-2xs transition"
            >
              View Printable Receipt 🖨️
            </Link>
          )}
        </div>
      </header>

      {/* Main Billing Workspace */}
      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {loading ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="inline-block animate-spin w-8 h-8 border-3 border-slate-800 border-t-transparent rounded-full"></div>
            <p className="text-xs font-bold text-slate-700">Loading Order Bill...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-rose-200 p-8 shadow-2xs space-y-3">
            <span className="text-4xl block">⚠️</span>
            <h3 className="text-base font-extrabold text-slate-900">{error}</h3>
            <p className="text-xs text-slate-500">Only served orders are eligible for billing.</p>
            <Link
              to={backLink}
              className="inline-block px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl mt-2"
            >
              Return to Order Details
            </Link>
          </div>
        ) : bill ? (
          <div className="space-y-6">
            {/* Bill Paper Invoice View */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              {/* Restaurant Header */}
              <div className="text-center border-b border-slate-100 pb-6 space-y-1">
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  {bill.restaurant?.name || 'Restaurant'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {bill.restaurant?.address ? `${bill.restaurant.address}, ${bill.restaurant.city || ''}` : 'Fine Dining Restaurant'}
                </p>
                {bill.restaurant?.phone && (
                  <p className="text-xs text-slate-400">Phone: {bill.restaurant.phone}</p>
                )}
                {bill.restaurant?.gst_number && (
                  <p className="text-[11px] font-mono text-slate-400">GSTIN: {bill.restaurant.gst_number}</p>
                )}
              </div>

              {/* Order Information Roster */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold">
                <div>
                  <span className="text-slate-400 text-[11px] block">Order Number</span>
                  <span className="text-slate-900 font-mono font-bold text-sm">#{bill.order_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Table</span>
                  <span className="text-slate-900 font-bold text-sm">Table {bill.table?.table_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Staff Server</span>
                  <span className="text-slate-900 font-medium">{bill.staff?.name || 'Staff'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Date & Time</span>
                  <span className="text-slate-700 font-medium">
                    {bill.created_at ? new Date(bill.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Itemized Line Items Table */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ordered Dishes & Items ({bill.items?.length || 0})
                </span>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Item Description</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {bill.items?.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900 capitalize">
                            {item.name}
                            {item.notes && (
                              <span className="block text-[11px] text-rose-600 font-medium">Note: {item.notes}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-slate-800">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-slate-600">₹{Number(item.price).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-extrabold text-slate-900">
                            ₹{Number(item.subtotal).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{Number(bill.subtotal).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Taxes (GST 5%)</span>
                  <span className="font-semibold text-slate-900">₹{Number(bill.tax).toFixed(2)}</span>
                </div>

                {bill.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{Number(bill.discount).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-3">
                  <span>Grand Total Payable</span>
                  <span className="text-xl font-black text-slate-900">₹{Number(bill.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Section Box */}
            {!bill.is_paid ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>💳</span> Select Payment Method
                  </h3>
                  <p className="text-xs text-slate-500">Choose customer payment method to settle order bill</p>
                </div>

                {/* Radio Options Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
                      paymentMethod === 'cash'
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl">💵</span>
                    <span className="text-xs font-extrabold">Cash</span>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
                      paymentMethod === 'upi'
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl">📱</span>
                    <span className="text-xs font-extrabold">UPI QR</span>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
                      paymentMethod === 'card'
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl">💳</span>
                    <span className="text-xs font-extrabold">Card</span>
                  </label>
                </div>

                {/* Complete Payment Submit Button */}
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={processing}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm transition cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>✅</span>
                  <span>Complete Payment ₹{Number(bill.total).toFixed(2)}</span>
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-3">
                <span className="text-4xl block">🎉</span>
                <h3 className="text-base font-extrabold text-emerald-900">Payment Successfully Completed</h3>
                <p className="text-xs text-emerald-700 font-medium">
                  Payment Number: <span className="font-mono font-bold">{bill.payment?.payment_number}</span> | Method: {bill.payment?.payment_method?.toUpperCase()}
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    to={receiptLink}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs transition"
                  >
                    View & Print Receipt 🖨️
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Payment Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="text-center space-y-2">
              <span className="text-4xl block">💳</span>
              <h3 className="text-lg font-black text-slate-900">Confirm Payment Settlement</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to process payment for Order{' '}
                <span className="font-bold text-slate-800 font-mono">#{bill?.order_number}</span>?
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs font-semibold">
              <div className="flex justify-between text-slate-600">
                <span>Total Amount:</span>
                <span className="font-extrabold text-slate-900 text-sm">₹{Number(bill?.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Selected Method:</span>
                <span className="font-bold text-slate-900 uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Table to Free:</span>
                <span className="font-bold text-emerald-700">Table {bill?.table?.table_number || 'N/A'} → Available</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={processing}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={processing}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default BillPage
