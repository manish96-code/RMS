import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState('This Week')

  const [dishesList, setDishesList] = useState([])

  const fetchAdminData = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/api/admin/dashboard`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load admin dashboard API')
        return res.json()
      })
      .then((data) => {
        setAdminData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching admin data:', err)
        setError('Failed to fetch admin analytics. Check backend server connection.')
        setLoading(false)
      })
  }

  const fetchDishes = () => {
    fetch(`${API_BASE_URL}/api/dishes`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.dishes) {
          setDishesList(resData.dishes)
        }
      })
      .catch((err) => console.error('Error loading dishes:', err))
  }

  useEffect(() => {
    fetchAdminData()
    fetchDishes()
  }, [])

  const stats = adminData?.stats || {
    total_revenue: 348500,
    today_revenue: 42850,
    weekly_revenue: 245000,
    total_orders: 1240,
    today_orders: 38,
    avg_order_value: 1127,
    total_customers: 890,
    total_staff: 5,
    occupied_tables: '9 / 15',
  }

  const weeklySales = adminData?.weekly_sales || []
  const topDishes = adminData?.top_dishes || []
  const maxSales = Math.max(...weeklySales.map((s) => s.sales), 1)

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased text-left font-sans">
      
      {/* Shared Admin Sidebar */}
      <AdminSidebar dishesCount={dishesList.length} />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Header Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Dashboard Overview</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time sales performance, revenue analytics & menu summary
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-lg focus:outline-none"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>

            <Link
              to="/admin/add-product"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
            >
              <span>+</span> Add Product
            </Link>
          </div>
        </div>

        {/* Loading & Error Notification */}
        {loading && (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading analytics...</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchAdminData} className="underline font-semibold">Retry</button>
          </div>
        )}

        {/* OVERVIEW CONTENT */}
        {!loading && !error && (
          <div className="space-y-6">
            
            {/* KPI Metric Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-2xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</div>
                <div className="text-2xl font-bold text-slate-900">₹{stats.total_revenue.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-600 font-medium">↑ +18.4% this month</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-2xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Sales</div>
                <div className="text-2xl font-bold text-slate-900">₹{stats.today_revenue.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 font-medium">{stats.today_orders} orders today</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-2xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Order Value</div>
                <div className="text-2xl font-bold text-slate-900">₹{stats.avg_order_value}</div>
                <div className="text-[11px] text-slate-500 font-medium">{stats.total_orders} total orders</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-2xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Dishes</div>
                <div className="text-2xl font-bold text-slate-900">{dishesList.length}</div>
                <div className="text-[11px] text-slate-500 font-medium">Live menu products</div>
              </div>
            </div>

            {/* Revenue Visualizer & Financial Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Weekly Sales Chart (8 / 12) */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Weekly Sales Performance</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Daily Revenue Breakdown (Mon - Sun)</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                    Weekly Total: ₹{stats.weekly_revenue.toLocaleString()}
                  </span>
                </div>

                {/* Bar Chart */}
                <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 pb-3">
                  {weeklySales.map((item, idx) => {
                    const heightPercent = Math.round((item.sales / maxSales) * 100)
                    const isHighlight = item.day === 'Sat' || item.day === 'Sun'

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow pointer-events-none mb-1 whitespace-nowrap">
                          ₹{item.sales.toLocaleString()}
                        </div>

                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[40px] rounded-t transition-all ${
                            isHighlight ? 'bg-slate-900' : 'bg-slate-700/80 hover:bg-slate-800'
                          }`}
                        ></div>

                        <span className="text-xs font-semibold text-slate-600 mt-1">{item.day}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
                  <span>Weekday Avg: ₹38,500</span>
                  <span>Weekend Peak: ₹70,000+</span>
                </div>
              </div>

              {/* Financial Summary Card (4 / 12) */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                  Financial Overview
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Gross Sales</span>
                    <span className="font-bold text-slate-900">₹3,48,500</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">GST (5%)</span>
                    <span className="font-bold text-slate-900">₹17,425</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Discounts</span>
                    <span className="font-bold text-rose-600">- ₹4,200</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-slate-800">Net Profit Margin</span>
                    <span className="font-bold text-emerald-600 text-sm">34.8%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* TOP DISHES SUMMARY */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Top Selling Dishes</h3>
                  <p className="text-xs text-slate-500">Ranked by sales volume & revenue</p>
                </div>

                <Link to="/admin/products" className="text-xs font-semibold text-slate-700 hover:text-slate-900">
                  View All Products →
                </Link>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Dish Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Units Sold</th>
                      <th className="px-4 py-3">Total Revenue</th>
                      <th className="px-4 py-3 text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {topDishes.map((dish, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-bold text-slate-900">{dish.name}</td>
                        <td className="px-4 py-3 text-slate-600">{dish.category}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{dish.sales} units</td>
                        <td className="px-4 py-3 font-bold text-slate-900">₹{dish.revenue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-amber-600 font-semibold">★ {dish.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  )
}

export default AdminDashboard
