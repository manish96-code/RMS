import React from 'react'

const RestaurantForm = ({
  formData,
  fieldErrors,
  onChange,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 text-xs font-medium text-left">
      
      {/* 1. Basic Information Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Basic Information</h2>
            <p className="text-[11px] text-slate-500">Official name and contact details for customer communication</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Restaurant Name */}
          <div>
            <label htmlFor="name" className="block font-semibold text-slate-700 mb-1">
              Restaurant Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={onChange}
              placeholder="e.g. Taste of India"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                fieldErrors.name
                  ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
              }`}
            />
            {fieldErrors.name && (
              <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                ⚠️ {fieldErrors.name}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-semibold text-slate-700 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={onChange}
                placeholder="restaurant@example.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                  fieldErrors.email
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                }`}
              />
              {fieldErrors.email && (
                <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                  ⚠️ {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block font-semibold text-slate-700 mb-1">
                Contact Phone / Mobile
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={onChange}
                placeholder="9876543210"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                  fieldErrors.phone
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                }`}
              />
              {fieldErrors.phone && (
                <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                  ⚠️ {fieldErrors.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Address Details Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Address & Location</h2>
            <p className="text-[11px] text-slate-500">Physical outlet address printed on receipts and invoices</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Street Address */}
          <div>
            <label htmlFor="address" className="block font-semibold text-slate-700 mb-1">
              Street / Building Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={onChange}
              placeholder="e.g. Plot 42, Main Commercial Road"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label htmlFor="city" className="block font-semibold text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city || ''}
                onChange={onChange}
                placeholder="Patna"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block font-semibold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state || ''}
                onChange={onChange}
                placeholder="Bihar"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
              />
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block font-semibold text-slate-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode || ''}
                onChange={onChange}
                placeholder="800001"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                  fieldErrors.pincode
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-600'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-slate-800'
                }`}
              />
              {fieldErrors.pincode && (
                <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                  ⚠️ {fieldErrors.pincode}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Business Information Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Business & Timing</h2>
            <p className="text-[11px] text-slate-500">Tax registration and daily operational hours</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* GST Number */}
          <div>
            <label htmlFor="gst_number" className="block font-semibold text-slate-700 mb-1">
              GST Number (Optional)
            </label>
            <input
              type="text"
              id="gst_number"
              name="gst_number"
              value={formData.gst_number || ''}
              onChange={onChange}
              placeholder="10ABCDE1234F1Z5"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
            />
          </div>

          {/* Opening Time */}
          <div>
            <label htmlFor="opening_time" className="block font-semibold text-slate-700 mb-1">
              Opening Time
            </label>
            <input
              type="text"
              id="opening_time"
              name="opening_time"
              value={formData.opening_time || ''}
              onChange={onChange}
              placeholder="10:00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
            />
          </div>

          {/* Closing Time */}
          <div>
            <label htmlFor="closing_time" className="block font-semibold text-slate-700 mb-1">
              Closing Time
            </label>
            <input
              type="text"
              id="closing_time"
              name="closing_time"
              value={formData.closing_time || ''}
              onChange={onChange}
              placeholder="22:00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
            />
          </div>
        </div>

        {/* Operational Status */}
        <div>
          <label htmlFor="status" className="block font-semibold text-slate-700 mb-1">
            Outlet Operational Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'active'}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-800 transition"
          >
            <option value="active">Active (Open for business)</option>
            <option value="inactive">Inactive (Temporarily closed)</option>
          </select>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Save Restaurant Settings</span>
            </>
          )}
        </button>
      </div>

    </form>
  )
}

export default RestaurantForm
