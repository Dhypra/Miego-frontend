import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — handle error global
api.interceptors.response.use(
  res => res.data,
  err => {
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
