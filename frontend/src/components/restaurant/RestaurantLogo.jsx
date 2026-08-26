import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { restaurantService } from '../../services/restaurantService'

const RestaurantLogo = ({ currentLogoUrl, onLogoUpdated }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Client-side file type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG, and WEBP image files are allowed.')
      return
    }

    // Client-side size check (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must not exceed 2MB.')
      return
    }

    // Local preview
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)

    // Upload to API
    setIsUploading(true)
    const { ok, data } = await restaurantService.uploadRestaurantLogo(file)

    if (ok && data.success) {
      toast.success(data.message || 'Restaurant logo updated!')
      if (onLogoUpdated && data.data) {
        onLogoUpdated(data.data)
      }
    } else {
      toast.error(data.message || 'Failed to upload logo.')
      setPreviewUrl('')
    }

    setIsUploading(false)
  }

  const displayLogo = previewUrl || currentLogoUrl

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 text-base font-bold">
          🖼️
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Restaurant Logo</h2>
          <p className="text-[11px] text-slate-500">Upload official logo for receipts & menu branding</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
        {/* Logo Image Box */}
        <div className="w-28 h-28 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center relative shrink-0 shadow-2xs">
          {displayLogo ? (
            <img
              src={displayLogo}
              alt="Restaurant Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className="text-center p-4">
              <span className="text-3xl block">🍽️</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">No Logo Uploaded</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="space-y-2 text-xs text-left">
          <label className="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow-2xs">
            <span>📷 Choose New Logo</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          <p className="text-[11px] text-slate-400">
            Allowed formats: JPG, JPEG, PNG, WEBP. Maximum file size: 2MB.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RestaurantLogo
