import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import AdminSidebar from '../components/AdminSidebar'

const Profile = () => {
  const { user, role, updateUser } = useAuth()

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || user?.phone || '',
  })
  const [profileErrors, setProfileErrors] = useState({})
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Profile Change Handler
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Password Change Handler
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Profile Submit Handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    setProfileErrors({})

    const { ok, data } = await authService.updateProfile(profileData)

    if (ok && data.success) {
      toast.success(data.message || 'Profile updated successfully!')
      if (data.data?.user) {
        updateUser(data.data.user)
      }
    } else {
      if (data.errors) {
        const parsed = {}
        Object.keys(data.errors).forEach((key) => {
          parsed[key] = data.errors[key][0]
        })
        setProfileErrors(parsed)
      } else {
        toast.error(data.message || 'Failed to update profile.')
      }
    }

    setIsUpdatingProfile(false)
  }

  // Password Submit Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setPasswordErrors({})

    const { ok, data } = await authService.changePassword(passwordData)

    if (ok && data.success) {
      toast.success(data.message || 'Password changed successfully!')
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      })
    } else {
      if (data.errors) {
        const parsed = {}
        Object.keys(data.errors).forEach((key) => {
          parsed[key] = data.errors[key][0]
        })
        setPasswordErrors(parsed)
      } else {
        toast.error(data.message || 'Failed to change password.')
      }
    }

    setIsChangingPassword(false)
  }

  const isAdmin = role === 'admin'

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased text-left">
      {isAdmin && <AdminSidebar />}

      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Profile & Security</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              View details, update profile information and change password
            </p>
          </div>

          <Link
            to={isAdmin ? '/admin/dashboard' : '/staff/dashboard'}
            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl transition shadow-2xs"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Update Profile Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 text-base font-bold">
                👤
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Personal Information</h2>
                <p className="text-[11px] text-slate-500">Update your name, email and mobile number</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} noValidate className="space-y-4 text-xs font-medium">
              
              {/* Role & Status Info Badges */}
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                  Role: {user?.role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  Status: {user?.status}
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                    profileErrors.name
                      ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                  }`}
                />
                {profileErrors.name && (
                  <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                    ⚠️ {profileErrors.name}
                  </span>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                    profileErrors.email
                      ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                  }`}
                />
                {profileErrors.email && (
                  <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                    ⚠️ {profileErrors.email}
                  </span>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobile" className="block font-semibold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={profileData.mobile}
                  onChange={handleProfileChange}
                  placeholder="9876543210"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                    profileErrors.mobile
                      ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                  }`}
                />
                {profileErrors.mobile && (
                  <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                    ⚠️ {profileErrors.mobile}
                  </span>
                )}
              </div>

              {/* Submit Profile */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
                >
                  {isUpdatingProfile ? 'Saving Changes...' : 'Update Profile'}
                </button>
              </div>

            </form>
          </div>

          {/* Change Password Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 text-base font-bold">
                🔒
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
                <p className="text-[11px] text-slate-500">Ensure your account uses a strong password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} noValidate className="space-y-4 text-xs font-medium">
              
              {/* Current Password */}
              <div>
                <label htmlFor="current_password" className="block font-semibold text-slate-700 mb-1">
                  Current Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                    passwordErrors.current_password
                      ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                  }`}
                />
                {passwordErrors.current_password && (
                  <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                    ⚠️ {passwordErrors.current_password}
                  </span>
                )}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="new_password" className="block font-semibold text-slate-700 mb-1">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                    passwordErrors.new_password
                      ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                  }`}
                />
                {passwordErrors.new_password && (
                  <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                    ⚠️ {passwordErrors.new_password}
                  </span>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="new_password_confirmation" className="block font-semibold text-slate-700 mb-1">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
                />
              </div>

              {/* Submit Password */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
                >
                  {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>

            </form>
          </div>

        </div>

      </main>
    </div>
  )
}

export default Profile
