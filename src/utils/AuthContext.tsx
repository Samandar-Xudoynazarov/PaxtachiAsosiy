import React, { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../services/api'
import type { LoginRequest, LoginResponse } from '../types'

interface AuthContextType {
  user: LoginResponse | null
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(() => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  })

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authApi.login(data)
    const userData = res.data

    // Token turli fieldlarda kelishi mumkin
    const rawToken =
      userData.token ||
      (userData as any).accessToken ||
      (userData as any).access_token ||
      (userData as any).jwt

    // Bearer prefix bo'lsa olib tashlaymiz, sof token saqlaymiz
    const cleanToken = rawToken?.startsWith('Bearer ')
      ? rawToken.slice(7)
      : rawToken

    localStorage.setItem('token', cleanToken)
    localStorage.setItem('user', JSON.stringify({ ...userData, token: cleanToken }))
    setUser({ ...userData, token: cleanToken } as LoginResponse)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}