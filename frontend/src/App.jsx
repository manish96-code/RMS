import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <nav className="p-4 bg-white border-b border-slate-200 flex justify-center gap-6 font-semibold shadow-sm">
        <Link to="/" className="text-slate-600 hover:text-blue-600 transition">Home</Link>
        <Link to="/create" className="text-slate-600 hover:text-blue-600 transition">Add Student</Link>
      </nav>

      <div className="p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </div>
    </div>
  )
}

export default App


