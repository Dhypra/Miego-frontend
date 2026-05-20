import { Plus, Minus } from 'lucide-react'
import useCartStore from '../store/cartStore'
import { clsx } from 'clsx'

const fmt = n => 'Rp' + n.toLocaleString('id-ID')

export default function MenuCard({ menu }) {
  const items     = useCartStore(s => s.items)
  const addItem   = useCartStore(s => s.addItem)
  const removeItem= useCartStore(s => s.removeItem)
  const qty = items[menu.id] || 0

  return (
    <div className={clsx('card overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5', qty > 0 && 'ring-2 ring-brand-400')}>
      {/* Image area */}
      <div className="h-24 bg-orange-50 flex items-center justify-center text-4xl select-none">
        {menu.emoji}
      </div>

      {/* Info */}
      <div className="p-3">
        {menu.spicy && (
          <span className="badge bg-brand-100 text-brand-700 mb-1.5">🌶 Pedas</span>
        )}
        <p className="font-medium text-sm leading-tight mb-0.5">{menu.name}</p>
        <p className="text-xs text-gray-400 mb-2 leading-relaxed">{menu.desc}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-500">{fmt(menu.price)}</span>

          {qty === 0 ? (
            <button onClick={() => addItem(menu)} className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors active:scale-90">
              <Plus size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => removeItem(menu.id)} className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-90">
                <Minus size={12} />
              </button>
              <span className="text-sm font-semibold w-4 text-center">{qty}</span>
              <button onClick={() => addItem(menu)} className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors active:scale-90">
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
