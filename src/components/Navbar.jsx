import { ShoppingCart, LayoutDashboard, LogOut } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useCartStore from '../store/cartStore'
import useMenu from '../hooks/useMenu'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onCartOpen }) {
  const { menu }   = useMenu()
  const totalItems = useCartStore(s => s.totalItems)()
  const location   = useLocation()
  const navigate   = useNavigate()
  const { isLoggedIn, admin, logout } = useAuth()
  const isAdmin = location.pathname.startsWith('/admin')

  function handleLogout() {
    logout()
    toast.success('Berhasil logout')
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            🍜
          </div>
          <span className="font-semibold text-gray-900">MieGo</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link to="/" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!isAdmin ? 'bg-brand-500 text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            Menu
          </Link>

          {/* Tampilkan link Admin hanya kalau sudah login */}
          {isLoggedIn ? (
            <Link to="/admin" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isAdmin ? 'bg-brand-500 text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              <LayoutDashboard size={14} />
              Admin
            </Link>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              <LayoutDashboard size={14} />
              Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Tampilkan nama admin + tombol logout kalau sudah login */}
          {isLoggedIn && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:block">{admin?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}

          {/* Cart button — hanya di halaman customer */}
          {!isAdmin && (
            <button onClick={onCartOpen} className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Keranjang</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>

      </div>
    </nav>
  )
}
