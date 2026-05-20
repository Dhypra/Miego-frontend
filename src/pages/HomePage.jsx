import { useState } from 'react'
import { Search } from 'lucide-react'
import { clsx } from 'clsx'
import useMenu from '../hooks/useMenu'
import MenuCard from '../components/MenuCard'

const CAT_LABELS = { semua:'Semua', mie:'Mie', seafood:'Seafood', minuman:'Minuman', extra:'Extra' }

export default function HomePage() {
  const { menu, loading, categories } = useMenu()
  const [activeCat, setActiveCat] = useState('semua')
  const [search, setSearch] = useState('')

  const filtered = menu.filter(m => {
    const matchCat  = activeCat === 'semua' || m.category === activeCat
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 text-white py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-1">MieGo 🍜</h1>
        <p className="text-brand-100 text-sm">Mie & Seafood Segar — Pesan Sekarang!</p>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100 px-4 py-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9 text-sm bg-gray-50 border-gray-100"
            placeholder="Cari menu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={clsx(
                'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                activeCat === cat
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {CAT_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu grid */}
      <div className="max-w-6xl mx-auto p-4 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card h-44 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm">Menu tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map(m => <MenuCard key={m.id} menu={m} />)}
          </div>
        )}
      </div>
    </div>
  )
}
