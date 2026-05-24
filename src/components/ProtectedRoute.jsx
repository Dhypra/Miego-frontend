import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// =============================================
// ProtectedRoute — wrap halaman yang butuh login
// Kalau belum login → redirect ke /login
// =============================================
export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()

  // Tunggu cek token selesai dulu
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
          <span className="text-sm">Memuat...</span>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />

  return children
}
