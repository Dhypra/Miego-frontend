# 🍜 MieGo Frontend — React + Vite + Tailwind

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Salin env
cp .env.example .env

# 3. Isi .env
VITE_API_URL=http://localhost:3000
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx

# 4. Jalankan
npm run dev
```

Buka http://localhost:5173

## Struktur

```
src/
├── components/
│   ├── Navbar.jsx       ← Navigasi atas
│   ├── MenuCard.jsx     ← Kartu menu
│   └── CartDrawer.jsx   ← Drawer keranjang + checkout
├── pages/
│   ├── HomePage.jsx     ← Halaman menu customer
│   └── AdminPage.jsx    ← Dashboard admin
├── hooks/
│   └── useMenu.js       ← Fetch menu dari API
├── services/
│   └── api.js           ← Axios API client
├── store/
│   └── cartStore.js     ← Zustand state management
├── App.jsx              ← Router utama
└── main.jsx             ← Entry point
```

## Build untuk production

```bash
npm run build
# Output di folder dist/ — upload ke Vercel/Netlify
```
# Miego-frontend
