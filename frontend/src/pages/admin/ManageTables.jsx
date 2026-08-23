import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../components/AdminSidebar'
import { API_BASE_URL } from '../../../config'

const ManageTables = () => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddTableModal, setShowAddTableModal] = useState(false)

  // Add Table Form State
  const [newTable, setNewTable] = useState({
    table_no: '',
    capacity: 4,
    status: 'Available',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchTables = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/api/tables`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tables')
        return res.json()
      })
      .then((data) => {
        setTables(data.tables || data.data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching tables:', err)
        setError('Failed to fetch restaurant tables. Check backend connection.')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTables()
  }, [])

  // Handle Add Table Submit
  const handleCreateTableSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_no: newTable.table_no,
          capacity: parseInt(newTable.capacity),
          status: newTable.status,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || `Table ${newTable.table_no} added successfully!`)
        setShowAddTableModal(false)
        setNewTable({ table_no: '', capacity: 4, status: 'Available' })
        fetchTables()
      } else {
        toast.error(data.message || 'Failed to add table. Check table number uniqueness.')
      }
    } catch {
      toast.error('Unable to connect to server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete Table
  const handleDeleteTable = async (id, tableNo) => {
    if (!window.confirm(`Are you sure you want to remove Table "${tableNo}"?`)) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setTables((prev) => prev.filter((t) => t.id !== id))
        toast.success(`Table ${tableNo} removed.`)
      } else {
        toast.error('Failed to delete table.')
      }
    } catch {
      toast.error('Unable to connect to server.')
    }
  }

  // Table Status Counters
  const availableCount = tables.filter((t) => t.status === 'Available').length
  const occupiedCount = tables.filter((t) => t.status === 'Occupied').length
  const reservedCount = tables.filter((t) => t.status === 'Reserved').length
  const cleaningCount = tables.filter((t) => t.status === 'Cleaning').length

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased text-left font-sans">
      
      {/* Shared Admin Sidebar */}
      <AdminSidebar />

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-lg p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Restaurant Table</h3>
                <p className="text-xs text-slate-500 mt-0.5">Configure table capacity & seating for POS</p>
              </div>
              <button
                onClick={() => setShowAddTableModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTableSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Table Number / Identifier <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTable.table_no}
                  onChange={(e) => setNewTable({ ...newTable, table_no: e.target.value })}
                  placeholder="e.g. T-10 or VIP-1"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Seating Capacity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={newTable.capacity}
                    onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                    placeholder="4"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newTable.status}
                    onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Cleaning">Cleaning</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Adding Table...' : 'Add Table'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Restaurant Table Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage floor seating, table capacity & real-time occupancy ({tables.length} tables total)
            </p>
          </div>

          <button
            onClick={() => setShowAddTableModal(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span> Add New Table
          </button>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Tables</span>
            <span className="text-xl font-bold text-slate-900">{tables.length}</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Available</span>
            <span className="text-xl font-bold text-emerald-700">{availableCount}</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-amber-600 block">Occupied</span>
            <span className="text-xl font-bold text-amber-700">{occupiedCount}</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">Reserved</span>
            <span className="text-xl font-bold text-blue-700">{reservedCount}</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase font-bold text-purple-600 block">Cleaning</span>
            <span className="text-xl font-bold text-purple-700">{cleaningCount}</span>
          </div>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading restaurant tables...</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchTables} className="underline font-semibold">Retry</button>
          </div>
        )}

        {/* Floor Map Cards Grid */}
        {!loading && !error && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Floor Seating Map View</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {tables.map((t) => {
                const statusStyles = {
                  Available: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
                  Occupied: 'bg-amber-50/80 border-amber-200 text-amber-900',
                  Reserved: 'bg-blue-50/80 border-blue-200 text-blue-900',
                  Cleaning: 'bg-purple-50/80 border-purple-200 text-purple-900',
                }

                return (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between h-28 ${
                      statusStyles[t.status] || 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base">{t.table_no}</span>
                      <span className="text-[10px] font-bold bg-white/80 px-1.5 py-0.5 rounded shadow-2xs">
                        👥 {t.capacity} seats
                      </span>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold uppercase">{t.status}</div>
                      {t.status === 'Occupied' && (
                        <p className="text-[10px] opacity-80">{t.guest_count} guests • {t.order_id}</p>
                      )}
                      {t.status === 'Available' && (
                        <p className="text-[10px] text-emerald-600 font-medium">Ready for POS</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Table Management Data Table */}
        {!loading && !error && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-3 p-5">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              All Restaurant Tables List ({tables.length})
            </h2>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Table No</th>
                    <th className="px-4 py-3">Seating Capacity</th>
                    <th className="px-4 py-3">Current Status</th>
                    <th className="px-4 py-3">Active Guests</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {tables.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 font-mono text-slate-400">#{t.id}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{t.table_no}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{t.capacity} seats</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            t.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : t.status === 'Occupied'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : t.status === 'Reserved'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{t.guest_count > 0 ? `${t.guest_count} guests` : '-'}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteTable(t.id, t.table_no)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded text-xs font-semibold transition cursor-pointer"
                        >
                          🗑️ Delete Table
                        </button>
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

export default ManageTables
