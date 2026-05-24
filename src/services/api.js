import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ← TAMBAH INI — set token dari localStorage saat app load
const token = localStorage.getItem('miego_token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Response interceptor
api.interceptors.response.use(
  res => res.data,
  err => {
    // ← TAMBAH INI — kalau 401, hapus token dan redirect ke login
    if (err.response?.status === 401) {
      localStorage.removeItem('miego_token')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/login'
    }
    const msg = err.response?.data?.message || 'Terjadi kesalahan'
    return Promise.reject(new Error(msg))
  }
)

export const menuAPI = {
  getAll: () => api.get('/api/payment/menu'),
}

export const orderAPI = {
  createTransaction: (data) => api.post('/api/payment/create-transaction', data),
  checkStatus:       (orderId) => api.get(`/api/payment/status/${orderId}`),
  getAll:            () => api.get('/api/payment/orders'),
  updateStatus:      (orderId, orderStatus) => api.patch(`/api/payment/orders/${orderId}/status`, { orderStatus }),
  getStats:          () => api.get('/api/payment/stats'),
}

export default api