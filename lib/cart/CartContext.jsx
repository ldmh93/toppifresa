'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { validarCupon } from '@/lib/data/cupones'

const CartContext = createContext(null)

const CART_KEY = 'toppifresa_cart_v1'
const FAVS_KEY = 'toppifresa_favs_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [coupon, setCoupon] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Carga inicial desde localStorage (persiste aunque se recargue la página)
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(CART_KEY) || 'null')
      if (saved?.items?.length) setItems(saved.items)
      if (saved?.coupon) setCoupon(saved.coupon)
      setFavorites(JSON.parse(window.localStorage.getItem(FAVS_KEY) || '[]'))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(CART_KEY, JSON.stringify({ items, coupon }))
  }, [items, coupon, hydrated])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(FAVS_KEY, JSON.stringify(favorites))
  }, [favorites, hydrated])

  const addItem = useCallback((product, qty = 1, note = '') => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === product.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = {
          ...copy[idx],
          qty: copy[idx].qty + qty,
          note: note.trim() ? note.trim() : copy[idx].note,
        }
        return copy
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          emoji: product.emoji,
          price: product.price,
          colors: product.colors,
          note: note.trim(),
          qty,
        },
      ]
    })
  }, [])

  const updateQty = useCallback((id, qty) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
    ), [])

  const updateNote = useCallback((id, note) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, note } : i))), [])

  const removeItem = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), [])

  const clearCart = useCallback(() => {
    setItems([])
    setCoupon(null)
  }, [])

  const toggleFavorite = useCallback((id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])), [])

  const applyCoupon = useCallback((code) => {
    const c = validarCupon(code)
    if (c) {
      setCoupon(c)
      return true
    }
    return false
  }, [])

  const removeCoupon = useCallback(() => setCoupon(null), [])

  const subtotal = useMemo(() => items.reduce((acc, i) => acc + i.price * i.qty, 0), [items])

  const discount = useMemo(() => {
    if (!coupon) return 0
    const d = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value
    return Math.min(d, subtotal)
  }, [coupon, subtotal])

  const total = subtotal - discount
  const itemCount = useMemo(() => items.reduce((acc, i) => acc + i.qty, 0), [items])

  // Valor memoizado: evita re-renders innecesarios en todos los consumidores
  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      discount,
      total,
      coupon,
      favorites,
      drawerOpen,
      hydrated,
      addItem,
      updateQty,
      updateNote,
      removeItem,
      clearCart,
      toggleFavorite,
      applyCoupon,
      removeCoupon,
      setDrawerOpen,
    }),
    [
      items, itemCount, subtotal, discount, total, coupon, favorites, drawerOpen, hydrated,
      addItem, updateQty, updateNote, removeItem, clearCart, toggleFavorite, applyCoupon, removeCoupon,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
