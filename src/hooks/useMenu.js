import { useState, useEffect } from 'react'
import { menuAPI } from '../services/api'

// Menu fallback kalau backend belum jalan
const FALLBACK_MENU = [
  { id:1,  name:'Mie Goreng Original', desc:'Mie goreng telur + sayur segar',    price:25000, category:'mie',     emoji:'🍜', spicy:false, active:true },
  { id:2,  name:'Mie Goreng Pedas',    desc:'Level 1-5 bisa request',            price:27000, category:'mie',     emoji:'🌶️', spicy:true,  active:true },
  { id:3,  name:'Mie Rebus Seafood',   desc:'Kuah kaldu gurih + udang cumi',     price:32000, category:'mie',     emoji:'🍲', spicy:false, active:true },
  { id:4,  name:'Mie Goreng Seafood',  desc:'Mix udang, cumi, kerang pilihan',   price:35000, category:'mie',     emoji:'🍝', spicy:false, active:true },
  { id:5,  name:'Udang Bakar',         desc:'Udang segar bumbu bakar spesial',   price:45000, category:'seafood', emoji:'🦐', spicy:false, active:true },
  { id:6,  name:'Cumi Goreng Tepung',  desc:'Cumi crispy saus mayo homemade',    price:38000, category:'seafood', emoji:'🦑', spicy:false, active:true },
  { id:7,  name:'Kerang Saus Padang',  desc:'Kerang segar bumbu padang pedas',   price:35000, category:'seafood', emoji:'🐚', spicy:true,  active:true },
  { id:8,  name:'Ikan Bakar Kecap',    desc:'Ikan segar bumbu kecap manis',      price:42000, category:'seafood', emoji:'🐟', spicy:false, active:true },
  { id:9,  name:'Es Teh Manis',        desc:'Teh segar dengan gula aren',        price:8000,  category:'minuman', emoji:'🧋', spicy:false, active:true },
  { id:10, name:'Jus Jeruk',           desc:'Jeruk segar peras langsung',        price:12000, category:'minuman', emoji:'🍊', spicy:false, active:true },
  { id:11, name:'Es Kelapa Muda',      desc:'Kelapa muda asli segar',            price:15000, category:'minuman', emoji:'🥥', spicy:false, active:true },
  { id:12, name:'Nasi Putih',          desc:'Nasi pulen hangat',                 price:5000,  category:'extra',   emoji:'🍚', spicy:false, active:true },
]

export default function useMenu() {
  const [menu,    setMenu]    = useState(FALLBACK_MENU)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    menuAPI.getAll()
      .then(data => { if (data.menu?.length) setMenu(data.menu) })
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['semua', ...new Set(menu.map(m => m.category))]

  return { menu, loading, error, categories }
}
