import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import Edit from './pages/Edit'

const App = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition transform">
              🍽️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">Gourmet Haven</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">RMS</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Restaurant Management System</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
                location.pathname === '/'
                  ? 'bg-orange-50 text-orange-600 font-semibold border border-orange-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>🏠</span> Dashboard
            </Link>

            <Link
              to="/create"
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 ${
                location.pathname === '/create'
                  ? 'bg-orange-50 text-orange-600 font-semibold border border-orange-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>👥</span> Staff Directory
            </Link>
          </nav>

          {/* System Quick Status */}
          <div className="hidden lg:flex items-center gap-3 border-l border-slate-200 pl-5">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Restaurant POS
            </div>
          </div>

        </div>
      </header>

      {/* Main Page Content */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
