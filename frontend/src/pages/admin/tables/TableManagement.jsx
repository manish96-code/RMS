import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../../components/AdminSidebar'
import TableList from '../../../components/tables/TableList'
import TableForm from '../../../components/tables/TableForm'
import { tableService } from '../../../services/tableService'

const TableManagement = () => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingTable, setEditingTable] = useState(null)
  const [tableData, setTableData] = useState({ table_number: '', capacity: 4 })
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch Tables
  const fetchTables = async () => {
    setLoading(true)
    const { ok, data } = await tableService.getTables()
    if (ok && data.success) {
      setTables(data.data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTables()
  }, [])

  // Modal Handlers
  const handleOpenAdd = () => {
    setEditingTable(null)
    setTableData({ table_number: '', capacity: 4 })
    setFieldErrors({})
    setShowModal(true)
  }

  const handleOpenEdit = (table) => {
    setEditingTable(table)
    setTableData({
      table_number: table.table_number,
      capacity: table.capacity,
    })
    setFieldErrors({})
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFieldErrors({})

    let res
    if (editingTable) {
      res = await tableService.updateTable(editingTable.id, tableData)
    } else {
      res = await tableService.createTable(tableData)
    }

    const { ok, data } = res

    if (ok && data.success) {
      toast.success(data.message || 'Table saved successfully!')
      setShowModal(false)
      fetchTables()
    } else {
      if (data.errors) {
        const parsed = {}
        Object.keys(data.errors).forEach((key) => {
          parsed[key] = data.errors[key][0]
        })
        setFieldErrors(parsed)
      } else {
        toast.error(data.message || 'Failed to save table.')
      }
    }

    setIsSubmitting(false)
  }

  const handleToggleStatus = async (table) => {
    const nextStatus = table.status === 'available' ? 'occupied' : 'available'
    const { ok, data } = await tableService.updateTableStatus(table.id, nextStatus)

    if (ok && data.success) {
      toast.success(`Table ${table.table_number} marked as ${nextStatus}`)
      setTables((prev) =>
        prev.map((t) => (t.id === table.id ? { ...t, status: nextStatus } : t))
      )
    } else {
      toast.error('Failed to change table status.')
    }
  }

  const handleDeleteTable = async (table) => {
    if (table.status === 'occupied') {
      toast.error('This table is currently occupied and cannot be deleted.')
      return
    }

    if (!window.confirm(`Are you sure you want to delete table ${table.table_number}?`)) {
      return
    }

    const { ok, data } = await tableService.deleteTable(table.id)

    if (ok && data.success) {
      toast.success(`Table ${table.table_number} deleted successfully.`)
      setTables((prev) => prev.filter((t) => t.id !== table.id))
    } else {
      toast.error(data.message || 'Occupied table cannot be deleted.')
    }
  }

  const filteredTables = tables.filter((t) => {
    if (!statusFilter) return true
    return t.status === statusFilter
  })

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      <AdminSidebar />

      {/* Add / Edit Table Modal */}
      {showModal && (
        <TableForm
          tableData={tableData}
          fieldErrors={fieldErrors}
          onChange={(e) => setTableData({ ...tableData, [e.target.name]: e.target.value })}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          isEditing={!!editingTable}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Main Workspace */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Table Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage dining floor plan, seating capacities and table availability statuses ({tables.length} total tables)
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>+</span> Add Table
          </button>
        </div>

        {/* Status Filter Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
          <span className="text-slate-700">Floor Layout Status Overview</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                statusFilter === ''
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Tables ({tables.length})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                statusFilter === 'available'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              🟢 Available ({tables.filter((t) => t.status === 'available').length})
            </button>
            <button
              onClick={() => setStatusFilter('occupied')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                statusFilter === 'occupied'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              🔴 Occupied ({tables.filter((t) => t.status === 'occupied').length})
            </button>
          </div>
        </div>

        {/* Loading & Table Cards Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading floor map...</p>
          </div>
        ) : (
          <TableList
            tables={filteredTables}
            onEditTable={handleOpenEdit}
            onDeleteTable={handleDeleteTable}
            onToggleStatus={handleToggleStatus}
            isAdmin={true}
          />
        )}

      </main>
    </div>
  )
}

export default TableManagement
