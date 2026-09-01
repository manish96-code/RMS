import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import AdminSidebar from '../../components/AdminSidebar'
import { useAuth } from '../../context/AuthContext'
import { settingsService } from '../../services/settingsService'

const Profile = () => {
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    status: '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileErrors, setProfileErrors] = useState({})

  // Change Password State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({})

  // Fetch Current Profile
  const fetchProfile = async () => {
    setLoading(true)
    const res = await settingsService.getProfile()
    if (res.ok && res.data?.success) {
      const u = res.data.data?.user || user || {}
      setProfileData({
        name: u.name || '',
        email: u.email || '',
        mobile: u.mobile || u.phone || '',
        role: u.role || 'staff',
        status: u.status || 'active',
      })
    } else {
      if (user) {
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          mobile: user.mobile || user.phone || '',
          role: user.role || 'staff',
          status: user.status || 'active',
        })
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Handle Profile Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileErrors({})

    const res = await settingsService.updateProfile({
      name: profileData.name,
      email: profileData.email,
      mobile: profileData.mobile,
    })

    if (res.ok && res.data?.success) {
      toast.success('Profile information updated successfully!')
      const updatedUser = res.data.data?.user
      if (updatedUser) {
        const token = localStorage.getItem('token')
        login(updatedUser, token)
      }
      fetchProfile()
    } else {
      if (res.data?.errors) {
        setProfileErrors(res.data.errors)
      }
      toast.error(res.data?.message || 'Failed to update profile.')
    }
    setProfileSaving(false)
  }

  // Handle Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordSaving(true)
    setPasswordErrors({})

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error('New password confirmation does not match!')
      setPasswordErrors({ new_password_confirmation: ['Passwords do not match.'] })
      setPasswordSaving(false)
      return
    }

    const res = await settingsService.changePassword(passwordData)

    if (res.ok && res.data?.success) {
      toast.success('Password changed successfully!')
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      })
    } else {
      if (res.data?.errors) {
        setPasswordErrors(res.data.errors)
      }
      toast.error(res.data?.message || 'Failed to change password.')
    }
    setPasswordSaving(false)
  }

  const isAdmin = user?.role === 'admin'
  const backLink = isAdmin ? '/admin/dashboard' : '/staff/dashboard'

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      {/* Sidebar for Admin users */}
      {isAdmin && <AdminSidebar />}

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              to={backLink}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center transition shadow-2xs hover:bg-slate-100"
            >
              ←
            </Link>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                User Account & Security
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
                <span>👤</span> My Profile & Security
              </h1>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'security'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Change Password
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs space-y-2">
            <div className="inline-block animate-spin w-8 h-8 border-3 border-slate-800 border-t-transparent rounded-full"></div>
            <p className="text-xs font-bold text-slate-700">Loading Profile Details...</p>
          </div>
        ) : activeTab === 'profile' ? (
          /* Profile Details Form */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6 max-w-2xl">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>👤</span> Account Details
                </h3>
                <p className="text-xs text-slate-500">Update your name, email address, and mobile number</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-900 text-white uppercase tracking-wider">
                  {profileData.role}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  {profileData.status}
                </span>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900 font-semibold"
                />
                {profileErrors.name && (
                  <p className="text-[11px] text-rose-600 font-bold">{profileErrors.name[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                />
                {profileErrors.email && (
                  <p className="text-[11px] text-rose-600 font-bold">{profileErrors.email[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mobile Phone Number</label>
                <input
                  type="text"
                  value={profileData.mobile}
                  onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900 font-mono"
                />
                {profileErrors.mobile && (
                  <p className="text-[11px] text-rose-600 font-bold">{profileErrors.mobile[0]}</p>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition cursor-pointer disabled:opacity-50"
                >
                  {profileSaving ? 'Saving Changes...' : 'Save Profile Changes 💾'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Change Password Form */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6 max-w-2xl">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>🔒</span> Change Account Password
              </h3>
              <p className="text-xs text-slate-500">Ensure your password is strong and updated</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Current Password *</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, current_password: e.target.value })
                  }
                  required
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                />
                {passwordErrors.current_password && (
                  <p className="text-[11px] text-rose-600 font-bold">{passwordErrors.current_password[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">New Password *</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, new_password: e.target.value })
                  }
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                />
                {passwordErrors.new_password && (
                  <p className="text-[11px] text-rose-600 font-bold">{passwordErrors.new_password[0]}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Confirm New Password *</label>
                <input
                  type="password"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password_confirmation: e.target.value,
                    })
                  }
                  required
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
                />
                {passwordErrors.new_password_confirmation && (
                  <p className="text-[11px] text-rose-600 font-bold">
                    {passwordErrors.new_password_confirmation[0]}
                  </p>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition cursor-pointer disabled:opacity-50"
                >
                  {passwordSaving ? 'Updating Password...' : 'Update Password 🔐'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default Profile
