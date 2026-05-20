import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import useCartStore from '../store/cartStore'
import useMenu from '../hooks/useMenu'
import { orderAPI } from '../services/api'

const fmt = n => 'Rp' + Math.round(n).toLocaleString('id-ID')
const genId = () => 'MGO-' + Date.now().toString().slice(-6)

const TABLES = ['Meja 1','Meja 2','Meja 3','Meja 4','Meja 5','Meja 6','Takeaway']

export default function CartDrawer({ open, onClose }) {
  const { menu } = useMenu()
  const store = useCartStore()
  const [loading, setLoading] = useState(false)

  const lines    = store.cartLines(menu)
  const subtotal = store.subtotal(menu)
  const fee      = store.fee(menu)
  const total    = store.total(menu)

  async function handleCheckout() {
    if (!store.tableNumber) return toast.error('Pilih meja dulu!')
    if (!lines.length) return toast.error('Keranjang masih kosong!')

    setLoading(true)
    const orderId = genId()

    try {
      const res = await orderAPI.createTransaction({
        orderId,
        customer: store.customerName || 'Pelanggan',
        table:    store.tableNumber,
        items:    lines.map(l => ({ name: l.name, emoji: l.emoji, qty: l.qty, price: l.price })),
        subtotal, fee, total,
      })

      // Buka Midtrans Snap popup
      if (window.snap && res.snapToken) {
        window.snap.pay(res.snapToken, {
          onSuccess: () => {
            toast.success('Pembayaran berhasil! 🎉')
            store.clearCart()
            onClose()
          },
          onPending: () => toast('Menunggu pembayaran...', { icon: '⏳' }),
          onError:   () => toast.error('Pembayaran gagal'),
          onClose:   () => setLoading(false),
        })
      } else {
        toast.success('Order dikirim! (mode simulasi)')
        store.clearCart()
        onClose()
      }
    } catch (err) {
      toast.error(err.message || 'Gagal membuat pesanan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-500" />
            Keranjang
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Customer info */}
        <div className="p-4 border-b border-gray-100 space-y-2">
          <input
            className="input text-sm"
            placeholder="Nama pelanggan (opsional)"
            value={store.customerName}
            onChange={e => store.setCustomerName(e.target.value)}
          />
          <select
            className="input text-sm"
            value={store.tableNumber}
            onChange={e => store.setTableNumber(e.target.value)}
          >
            <option value="">Pilih meja...</option>
            {TABLES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {lines.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">🍜</div>
              <p className="text-sm">Keranjang masih kosong</p>
              <p className="text-xs mt-1">Pilih menu di halaman utama</p>
            </div>
          ) : lines.map(line => (
            <div key={line.id} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {line.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{line.name}</p>
                <p className="text-xs text-brand-500 font-semibold">{fmt(line.subtotal)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => store.removeItem(line.id)} className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all">
                  {line.qty === 1 ? <Trash2 size={11} className="text-red-400" /> : <Minus size={11} />}
                </button>
                <span className="text-sm font-semibold w-5 text-center">{line.qty}</span>
                <button onClick={() => store.addItem(line)} className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 active:scale-90 transition-all">
                  <Plus size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Biaya layanan (2%)</span><span>{fmt(fee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-1 border-t border-gray-200">
                <span>Total</span><span className="text-brand-500">{fmt(total)}</span>
              </div>
            </div>
            <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Memproses...</>
              ) : '💳 Bayar Sekarang'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
