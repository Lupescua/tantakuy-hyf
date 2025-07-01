
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import API from '@/utils/axios'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({
  user: null,
  loading: true,
  refresh: () => {}
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // load current user once on mount
  useEffect(() => {
    async function loadMe() {
      setLoading(true)
      try {
        const { data } = await API.get('/auth/me')
        setUser(data.success ? data.user : null)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadMe()
  }, [])

  // call after login or logout to re-fetch /auth/me
  const refresh = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/auth/me')
      setUser(data.success ? data.user : null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
