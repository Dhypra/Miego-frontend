import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin,   setAdmin]   = useState(null)
  const [loading, setLoading] = useState(true)

  // Cek token saat pertama load
  useEffect(() => {
    const token = localStorage.getItem('miego_token')
    if (!token) { setLoading(false); return }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    api.get('/api/auth/me')
      .then(data => setAdmin(data.admin))
      .catch(() => {
        localStorage.removeItem('miego_token')
        delete api.defaults.headers.common['Authorization']
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const data = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('miego_token', data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setAdmin(data.admin)
    return data
  }

  function logout() {
    localStorage.removeItem('miego_token')
    delete api.defaults.headers.common['Authorization']
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isLoggedIn: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
