import { create } from 'zustand'

const FEE_RATE = 0

const useCartStore = create((set, get) => ({
  items: {},        // { menuId: quantity }
  customerName: '',
  tableNumber: '',

  addItem: (menu) => set(state => ({
    items: { ...state.items, [menu.id]: (state.items[menu.id] || 0) + 1 }
  })),

  removeItem: (menuId) => set(state => {
    const items = { ...state.items }
    if (items[menuId] > 1) items[menuId]--
    else delete items[menuId]
    return { items }
  }),

  clearCart: () => set({ items: {}, customerName: '', tableNumber: '' }),

  setCustomerName: (name)  => set({ customerName: name }),
  setTableNumber:  (table) => set({ tableNumber: table }),

  // Computed
  totalItems: () => Object.values(get().items).reduce((s, q) => s + q, 0),

  cartLines: (menuList) => Object.entries(get().items)
    .map(([id, qty]) => {
      const menu = menuList.find(m => m.id === Number(id))
      return menu ? { ...menu, qty, subtotal: menu.price * qty } : null
    })
    .filter(Boolean),

  subtotal: (menuList) => get().cartLines(menuList).reduce((s, l) => s + l.subtotal, 0),
  fee:      (menuList) => Math.round(get().subtotal(menuList) * FEE_RATE),
  total:    (menuList) => get().subtotal(menuList) + get().fee(menuList),
}))

export default useCartStore
