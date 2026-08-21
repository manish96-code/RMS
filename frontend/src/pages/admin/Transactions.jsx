import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const Transactions = () => {
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/dashboard`)
      .then((res) => res.json())
      .then((data) => {
        setAdminData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const transactions = adminData?.recent_transactions || []

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased text-left font-sans">
      <AdminSidebar />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Financial Transactions Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">Audit log of customer bill payments & payment modes</p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading transaction log...</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Txn ID</th>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Order Type</th>
                    <th className="px-4 py-3">Payment Method</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 font-mono text-slate-400">{txn.id}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{txn.order_id}</td>
                      <td className="px-4 py-3.5 text-slate-900 font-medium">{txn.customer}</td>
                      <td className="px-4 py-3.5 text-slate-600">{txn.type}</td>
                      <td className="px-4 py-3.5 text-slate-600">{txn.payment_method}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">₹{txn.amount}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            txn.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Transactions
