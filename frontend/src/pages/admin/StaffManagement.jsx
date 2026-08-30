import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../components/AdminSidebar'
import ResizableDrawer from '../../components/common/ResizableDrawer'
import { authService } from '../../services/authService'

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Create Staff Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    password_confirmation: '',
  })
  const [addErrors, setAddErrors] = useState({})
  const [isCreating, setIsCreating] = useState(false)

  // Edit Staff Modal State
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [editErrors, setEditErrors] = useState({})
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchStaffList = async () => {
    setLoading(true)
    setError('')
    const { ok, data } = await authService.getStaff()
    if (ok && data.success) {
      setStaffList(data.data?.staff || [])
    } else {
      setError(data.message || 'Failed to load staff roster.')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStaffList()
  }, [])

  // Handle Create Staff Submit
  const handleCreateStaffSubmit = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    setAddErrors({})

    const { ok, data } = await authService.createStaff(newStaff)

    if (ok && data.success) {
      toast.success(data.message || 'Staff member created successfully!')
      setShowAddModal(false)
      setNewStaff({
        name: '',
        email: '',
        mobile: '',
        password: '',
        password_confirmation: '',
      })
      fetchStaffList()
    } else {
      if (data.errors) {
        const parsed = {}
        Object.keys(data.errors).forEach((key) => {
          parsed[key] = data.errors[key][0]
        })
        setAddErrors(parsed)
      } else {
        toast.error(data.message || 'Failed to create staff member.')
      }
    }

    setIsCreating(false)
  }

  // Open Edit Staff Modal
  const handleOpenEdit = (staff) => {
    setEditingStaff({
      id: staff.id,
      name: staff.name,
      email: staff.email,
      mobile: staff.mobile || staff.phone || '',
      status: staff.status || 'active',
    })
    setEditErrors({})
    setShowEditModal(true)
  }

  // Handle Edit Staff Submit
  const handleUpdateStaffSubmit = async (e) => {
    e.preventDefault()
    if (!editingStaff) return
    setIsUpdating(true)
    setEditErrors({})

    const { ok, data } = await authService.updateStaff(editingStaff.id, {
      name: editingStaff.name,
      email: editingStaff.email,
      mobile: editingStaff.mobile,
      status: editingStaff.status,
    })

    if (ok && data.success) {
      toast.success(data.message || 'Staff updated successfully!')
      setShowEditModal(false)
      fetchStaffList()
    } else {
      if (data.errors) {
        const parsed = {}
        Object.keys(data.errors).forEach((key) => {
          parsed[key] = data.errors[key][0]
        })
        setEditErrors(parsed)
      } else {
        toast.error(data.message || 'Failed to update staff member.')
      }
    }

    setIsUpdating(false)
  }

  // Toggle Staff Active / Inactive Status
  const handleToggleStatus = async (staff) => {
    const { ok, data } = await authService.toggleStaffStatus(staff.id)
    if (ok && data.success) {
      toast.success(data.message || `Status updated for ${staff.name}`)
      setStaffList((prev) =>
        prev.map((s) => (s.id === staff.id ? { ...s, ...data.data?.staff } : s))
      )
    } else {
      toast.error('Failed to change status.')
    }
  }

  // Delete Staff
  const handleDeleteStaff = async (staff) => {
    if (!window.confirm(`Are you sure you want to delete staff member "${staff.name}"?`)) {
      return
    }

    const { ok, data } = await authService.deleteStaff(staff.id)
    if (ok && data.success) {
      toast.success(`Staff member "${staff.name}" deleted.`)
      setStaffList((prev) => prev.filter((s) => s.id !== staff.id))
    } else {
      toast.error(data.message || 'Failed to delete staff member.')
    }
  }

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.mobile && s.mobile.includes(searchQuery))
  )

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      <AdminSidebar />

      {/* Create Staff Right-Side Slide-Over Drawer Modal */}
      {showAddModal && (
        <ResizableDrawer onClose={() => setShowAddModal(false)} initialWidth={460} storageKey="staff_drawer_width">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Add New Staff Member</h3>
              <p className="text-xs text-slate-500 mt-0.5">Automatically assigned role: Staff</p>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer transition"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateStaffSubmit} noValidate className="p-6 space-y-4 text-xs font-medium flex-1">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                placeholder="e.g. Rahul Kumar"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  addErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {addErrors.name && <span className="text-rose-600 text-[11px] mt-1 block">⚠️ {addErrors.name}</span>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                placeholder="e.g. rahul@restaurant.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  addErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {addErrors.email && <span className="text-rose-600 text-[11px] mt-1 block">⚠️ {addErrors.email}</span>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={newStaff.mobile}
                onChange={(e) => setNewStaff({ ...newStaff, mobile: e.target.value })}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                value={newStaff.password}
                onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                placeholder="At least 6 characters"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  addErrors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {addErrors.password && <span className="text-rose-600 text-[11px] mt-1 block">⚠️ {addErrors.password}</span>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                value={newStaff.password_confirmation}
                onChange={(e) => setNewStaff({ ...newStaff, password_confirmation: e.target.value })}
                placeholder="Re-enter password"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  addErrors.password_confirmation ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {addErrors.password_confirmation && (
                <span className="text-rose-600 text-[11px] mt-1 block">⚠️ {addErrors.password_confirmation}</span>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateStaffSubmit}
              disabled={isCreating}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {isCreating ? 'Creating Staff...' : 'Create Staff Member'}
            </button>
          </div>
        </ResizableDrawer>
      )}

      {/* Edit Staff Right-Side Slide-Over Drawer Modal */}
      {showEditModal && editingStaff && (
        <ResizableDrawer onClose={() => setShowEditModal(false)} initialWidth={460} storageKey="staff_drawer_width">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Update Staff Details</h3>
              <p className="text-xs text-slate-500 mt-0.5">Staff ID: #{editingStaff.id}</p>
            </div>
            <button
              onClick={() => setShowEditModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer transition"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdateStaffSubmit} noValidate className="p-6 space-y-4 text-xs font-medium flex-1">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={editingStaff.name}
                onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  editErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {editErrors.name && <span className="text-rose-600 text-[11px] mt-1 block">⚠️ {editErrors.name}</span>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={editingStaff.email}
                onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  editErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {editErrors.email && <span className="text-rose-600 text-[11px] mt-1 block">⚠️ {editErrors.email}</span>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={editingStaff.mobile || ''}
                onChange={(e) => setEditingStaff({ ...editingStaff, mobile: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                New Password (Optional)
              </label>
              <input
                type="password"
                value={editingStaff.password || ''}
                onChange={(e) => setEditingStaff({ ...editingStaff, password: e.target.value })}
                placeholder="Leave blank to keep current password"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                  editErrors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {editErrors.password && <span className="text-rose-600 text-[11px] mt-1 block">⚠️ {editErrors.password}</span>}
            </div>

            {editingStaff.password && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={editingStaff.password_confirmation || ''}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, password_confirmation: e.target.value })
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    editErrors.password_confirmation ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {editErrors.password_confirmation && (
                  <span className="text-rose-600 text-[11px] mt-1 block">⚠️ {editErrors.password_confirmation}</span>
                )}
              </div>
            )}
            
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Status</label>
              <select
                value={editingStaff.status}
                onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateStaffSubmit}
              disabled={isUpdating}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {isUpdating ? 'Saving Changes...' : 'Update Staff'}
            </button>
          </div>
        </ResizableDrawer>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create staff accounts, toggle active status & manage team members ({staffList.length} total staff)
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>+</span> Create New Staff
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-700">Staff Roster Directory</span>
          <input
            type="text"
            placeholder="Search by name, email or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:border-slate-800 transition"
          />
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-slate-800 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-medium">Loading staff roster...</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchStaffList} className="underline font-semibold cursor-pointer">Retry</button>
          </div>
        )}

        {/* Staff Table */}
        {!loading && !error && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs p-5">
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Staff Name</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">Mobile Number</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => {
                      const isActive = String(staff.status).toLowerCase() === 'active'

                      return (
                        <tr key={staff.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3.5 font-mono text-slate-400">#{staff.id}</td>
                          <td className="px-4 py-3.5 font-bold text-slate-900">{staff.name}</td>
                          <td className="px-4 py-3.5 text-slate-600">{staff.email}</td>
                          <td className="px-4 py-3.5 text-slate-600">{staff.mobile || staff.phone || '-'}</td>
                          <td className="px-4 py-3.5 uppercase font-bold text-slate-700">{staff.role}</td>

                          {/* Status Toggle Button */}
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => handleToggleStatus(staff)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              {isActive ? '🟢 Active' : '🔴 Inactive'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(staff)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                            >
                              ✏️ Edit
                            </button>

                            <button
                              onClick={() => handleDeleteStaff(staff)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-slate-400 text-xs">
                        No staff members found matching query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  )
}

export default StaffManagement
