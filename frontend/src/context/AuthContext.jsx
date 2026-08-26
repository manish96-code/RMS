import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(true)

  // Initialize auth state on mount / refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const { ok, data } = await authService.getUser()
          if (ok && data.success && data.data?.user) {
            setUser(data.data.user)
            setToken(storedToken)
          } else {
            // Token invalid or expired
            localStorage.removeItem('token')
            setToken('')
            setUser(null)
          }
        } catch {
          localStorage.removeItem('token')
          setToken('')
          setUser(null)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  // Login handler
  const login = async (credentials) => {
    const { ok, data } = await authService.login(credentials)

    if (ok && data.success && data.data?.token) {
      const authToken = data.data.token
      const authUser = data.data.user

      localStorage.setItem('token', authToken)
      setToken(authToken)
      setUser(authUser)

      toast.success(data.message || 'Login successful!')
      return { success: true, user: authUser }
    } else {
      const errorMsg = data.message || 'Invalid credentials'
      toast.error(errorMsg)
      return { success: false, message: errorMsg, errors: data.errors }
    }
  }

  // Logout handler
  const logout = async () => {
    await authService.logout()
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
    toast.success('Logged out successfully')
  }

  // Update user in local state
  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }))
  }

  const role = user ? strtolowerRole(user.role) : null
  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const strtolowerRole = (roleStr) => {
  return roleStr ? String(roleStr).toLowerCase() : ''
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
