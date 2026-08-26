import React, { useState } from 'react'
import TableCard from './TableCard'

const TableList = ({
  tables,
  onEditTable,
  onDeleteTable,
  onToggleStatus,
  isAdmin = false,
}) => {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'

  if (tables.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-4xl block mb-2">🪑</span>
        <h3 className="text-sm font-bold text-slate-700">No Tables Configured</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {isAdmin ? 'Click "+ Add Table" above to register dining tables.' : 'No tables available.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Switcher Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Showing {tables.length} tables</span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            📱 Visual Layout
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            📋 Data Roster
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onEdit={onEditTable}
              onDelete={onDeleteTable}
              onToggleStatus={onToggleStatus}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        /* Data Roster Mode */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs p-4">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Table No</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Status</th>
                  {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {tables.map((table) => {
                  const isAvailable = table.status === 'available'

                  return (
                    <tr key={table.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 font-bold text-slate-900 text-sm">
                        {table.table_number}
                      </td>

                      <td className="px-4 py-3.5 text-slate-700 font-semibold">
                        {table.capacity} Guests
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isAvailable ? '🟢 Available' : '🔴 Occupied'}
                        </span>
                      </td>

                      {isAdmin && (
                        <td className="px-4 py-3.5 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditTable(table)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => onDeleteTable(table)}
                            disabled={!isAvailable}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                              isAvailable
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableList
