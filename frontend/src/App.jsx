import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import Edit from './pages/Edit'
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  const location = useLocation()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans antialiased flex flex-col">
      {/* Top Luxury Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition transform">
                🍽️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-lg">Gourmet Haven</span>
                  <span className="text-[10px] uppercase font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                    RMS POS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Smart Restaurant Operating System
                </p>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 ml-4">
              <Link
                to="/"
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  location.pathname === '/'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>📊</span> Restaurant POS
              </Link>

              <Link
                to="/admin"
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  location.pathname === '/admin'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>👑</span> Admin Panel
              </Link>

              <Link
                to="/create"
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  location.pathname === '/create'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>👥</span> Staff Directory
              </Link>
            </nav>
          </div>

          {/* Right Header Status Bar & Live Clock */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {time.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            <Link
              to="/admin"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <span>⚙️</span> Admin Dashboard
            </Link>
          </div>

        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
