import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, ChefHat, CreditCard, BarChart3, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { orderAPI } from '../services/api'
import { clsx } from 'clsx'

const fmt = n => 'Rp' + Math.round(n).toLocaleString('id-ID')

const PAY_BADGE  = { paid:'bg-green-100 text-green-700', pending:'bg-amber-100 text-amber-700', failed:'bg-red-100 text-red-700' }
const ORD_BADGE  = { new:'bg-brand-100 text-brand-700', process:'bg-amber-100 text-amber-700', done:'bg-green-100 text-green-700', cancel:'bg-gray-100 text-gray-500' }
const PAY_LABEL  = { paid:'Lunas', pending:'Menunggu', failed:'Gagal' }
const ORD_LABEL  = { new:'Baru', process:'Diproses', done:'Selesai', cancel:'Batal' }
const PAY_METHOD = { qris:'QRIS', bank_transfer:'Transfer Bank', gopay:'GoPay', shopeepay:'ShopeePay', ovo:'OVO', dana:'DANA', simulation:'Simulasi' }

const TABS = [
  { id:'orders',   label:'Pesanan',    icon:ChefHat },
  { id:'payments', label:'Pembayaran', icon:CreditCard },
]

export default function AdminPage() {
  const [orders,  setOrders]  = useState([])
  const [stats,   setStats]   = useState({ totalOrders:0, totalRevenue:0, queueCount:0 })
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('orders')

  const load = useCallback(async () => {
    try {
      const [ordRes, stRes] = await Promise.all([orderAPI.getAll(), orderAPI.getStats()])
      setOrders(ordRes.orders || [])
      setStats(stRes)
    } catch {
      toast.error('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function updateStatus(orderId, orderStatus) {
    try {
      await orderAPI.updateStatus(orderId, orderStatus)
      setOrders(prev => prev.map(o => (o.id||o.orderId)===orderId ? {...o, orderStatus, status:orderStatus} : o))
      toast.success('Status diperbarui ✓')
    } catch { toast.error('Gagal update status') }
  }

  const statCards = [
    { label:'Total Pesanan', value:stats.totalOrders, color:'text-brand-500', icon:'📋' },
    { label:'Revenue Lunas', value:fmt(stats.totalRevenue), color:'text-green-600', icon:'💰' },
    { label:'Antrian Dapur', value:stats.queueCount, color:'text-amber-500', icon:'👨‍🍳' },
  ]

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Dashboard Admin</h1>
          <p className="text-sm text-gray-400">MieGo Restaurant</p>
        </div>
        <button onClick={load} disabled={loading} className="btn-secondary flex items-center gap-1.5 text-sm">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {statCards.map(s => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-xl font-bold ${s.color}`}>{loading ? '...' : s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={clsx('flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all', tab===t.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700')}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Memuat data...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">Belum ada pesanan</p>
          </div>
        ) : tab === 'orders' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  {['Order ID','Pelanggan','Meja','Menu','Total','Bayar','Status','Aksi'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id||o.orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{(o.id||o.orderId)?.slice(-8)}</td>
                    <td className="px-4 py-3 font-medium">{o.customer}</td>
                    <td className="px-4 py-3 text-gray-500">{o.table}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-32 truncate">{(o.items||[]).map(i=>`${i.qty}x${i.name}`).join(', ')}</td>
                    <td className="px-4 py-3 font-semibold text-brand-500">{fmt(o.total)}</td>
                    <td className="px-4 py-3"><span className={clsx('badge', PAY_BADGE[o.payStatus]||'bg-gray-100 text-gray-500')}>{PAY_LABEL[o.payStatus]||o.payStatus}</span></td>
                    <td className="px-4 py-3"><span className={clsx('badge', ORD_BADGE[o.orderStatus||o.status]||'bg-gray-100 text-gray-500')}>{ORD_LABEL[o.orderStatus||o.status]||o.orderStatus}</span></td>
                    <td className="px-4 py-3">
                      {(o.orderStatus||o.status)==='process' && (
                        <button onClick={() => updateStatus(o.id||o.orderId,'done')} className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                          <CheckCircle size={12} />Selesai
                        </button>
                      )}
                      {(o.orderStatus||o.status)==='new' && (
                        <button onClick={() => updateStatus(o.id||o.orderId,'process')} className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                          Proses
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  {['Order ID','Pelanggan','Metode','Total','Status','Waktu'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id||o.orderId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{(o.id||o.orderId)?.slice(-8)}</td>
                    <td className="px-4 py-3 font-medium">{o.customer}</td>
                    <td className="px-4 py-3 text-gray-500">{PAY_METHOD[o.paymentType]||'-'}</td>
                    <td className="px-4 py-3 font-semibold">{fmt(o.total)}</td>
                    <td className="px-4 py-3"><span className={clsx('badge', PAY_BADGE[o.payStatus]||'bg-gray-100 text-gray-500')}>{PAY_LABEL[o.payStatus]||o.payStatus}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-400">{o.time||new Date(o.createdAt).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
