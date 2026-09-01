import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../../components/AdminSidebar'
import { reportService } from '../../../services/reportService'

const SalesReport = () => {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState({
    from: '',
    to: '',
    total_sales: 0,
    total_paid_orders: 0,
    average_order_value: 0,
    daily_sales: [],
  })

  // Date Filters State
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [activeFilter, setActiveFilter] = useState('today')

  // Fetch Sales Report Data
  const fetchSalesReport = async (overrideFrom = null, overrideTo = null) => {
    setLoading(true)
    const filterFrom = overrideFrom !== null ? overrideFrom : fromDate
    const filterTo = overrideTo !== null ? overrideTo : toDate

    const res = await reportService.getSalesReport({ from: filterFrom, to: filterTo })
    if (res.ok && res.data?.success) {
      setReportData(res.data.data)
    } else {
      toast.error(res.data?.message || 'Failed to load sales report.')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSalesReport()
  }, [])

  // Quick Period Filter Handlers
  const handleQuickFilter = (period) => {
    setActiveFilter(period)
    const today = new Date()
    const formatDate = (d) => d.toISOString().split('T')[0]

    if (period === 'today') {
      const todayStr = formatDate(today)
      setFromDate(todayStr)
      setToDate(todayStr)
      fetchSalesReport(todayStr, todayStr)
    } else if (period === '7days') {
      const past7 = new Date()
      past7.setDate(today.getDate() - 6)
      const fromStr = formatDate(past7)
      const toStr = formatDate(today)
      setFromDate(fromStr)
      setToDate(toStr)
      fetchSalesReport(fromStr, toStr)
    } else if (period === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const fromStr = formatDate(firstDay)
      const toStr = formatDate(today)
      setFromDate(fromStr)
      setToDate(toStr)
      fetchSalesReport(fromStr, toStr)
    }
  }

  // Custom Form Submit
  const handleCustomFilterSubmit = (e) => {
    e.preventDefault()
    setActiveFilter('custom')
    fetchSalesReport(fromDate, toDate)
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      <AdminSidebar />

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Executive Sales Reporting
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
              <span>📈</span> Sales & Financial Reports
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Date-filtered sales performance, paid order counts & average bill metrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchSalesReport()}
              disabled={loading}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>🔄</span> Refresh Report
            </button>
          </div>
        </div>

        {/* 1. Date Filter Controls Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 mr-1">Quick Select:</span>
              <button
                onClick={() => handleQuickFilter('today')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeFilter === 'today'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => handleQuickFilter('7days')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeFilter === '7days'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => handleQuickFilter('month')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeFilter === 'month'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                This Month
              </button>
            </div>

            {/* Custom Date Range Picker */}
            <form onSubmit={handleCustomFilterSubmit} className="flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">From:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">To:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-2xs transition cursor-pointer"
              >
                Apply Filter
              </button>
            </form>
          </div>
        </div>

        {/* 2. Key Metrics Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Sales Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
              <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl text-lg font-bold">💰</span>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '...' : `₹${Number(reportData.total_sales || 0).toLocaleString()}`}
            </div>
            <p className="text-xs text-emerald-700 font-medium">
              From successful paid payments ({reportData.from} to {reportData.to})
            </p>
          </div>

          {/* Total Paid Orders Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paid Orders Count</span>
              <span className="p-2 bg-blue-50 text-blue-800 rounded-xl text-lg font-bold">🧾</span>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '...' : reportData.total_paid_orders || 0}
            </div>
            <p className="text-xs text-blue-700 font-medium">Completed and settled orders</p>
          </div>

          {/* Average Order Value Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Order Value (AOV)</span>
              <span className="p-2 bg-amber-50 text-amber-800 rounded-xl text-lg font-bold">📊</span>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '...' : `₹${Number(reportData.average_order_value || 0).toFixed(2)}`}
            </div>
            <p className="text-xs text-slate-500 font-medium">Average bill amount per order</p>
          </div>
        </div>

        {/* 3. Daily Sales Roster Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>📅</span> Daily Sales & Order Breakdown Roster
            </h3>
            <p className="text-xs text-slate-500">Day-by-day revenue breakdown for selected period</p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs font-semibold">
              Loading sales breakdown...
            </div>
          ) : reportData.daily_sales?.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <span className="text-4xl block">📊</span>
              <h4 className="text-sm font-bold text-slate-700">No Sales Found</h4>
              <p className="text-xs text-slate-400">No successful payments recorded for this date range.</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                  <tr>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5 text-center">Paid Orders</th>
                    <th className="px-4 py-3.5 text-right">Average Order Value</th>
                    <th className="px-4 py-3.5 text-right">Total Daily Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {reportData.daily_sales?.map((day, idx) => (
                    <tr key={day.date || idx} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-4 font-bold text-slate-900">
                        {new Date(day.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-slate-800">{day.orders}</td>
                      <td className="px-4 py-4 text-right text-slate-700">
                        ₹{Number(day.average_order_value).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right font-black text-slate-900 text-sm">
                        ₹{Number(day.sales).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SalesReport
