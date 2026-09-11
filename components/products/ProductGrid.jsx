'use client'

import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { getProductosPublicos, esVendible } from '@/lib/data/products'
import ProductCard from './ProductCard'

const FILTERS = [
  { id: 'todos', label: 'Todo el menú' },
  { id: 'popular', label: '🔥 Favoritos' },
  { id: 'nuevo', label: '✨ Nuevos' },
  { id: 'premium', label: '⭐ Premium' },
  { id: 'picante', label: '🌶️ Picantes' },
  { id: 'mexicano', label: '🇲🇽 Mexicano' },
  { id: 'cakes', label: '🥞 ToppiCakes' },
]

const filterMap = {
  todos: () => true,
  popular: (p) => p.popular,
  nuevo: (p) => p.isNew,
  premium: (p) => p.tag === 'Premium' || p.tag === 'Especial',
  picante: (p) => p.tag === 'Picante',
  mexicano: (p) => p.tag === 'Mexicano',
  cakes: (p) => p.id === 'toppi-cakes',
}

export default function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState('todos')

  // El catálogo no cambia en el cliente: se resuelve una sola vez.
  const disponibles = useMemo(() => getProductosPublicos(), [])

  const filtered = useMemo(() => {
    const fn = filterMap[activeFilter] || (() => true)
    // Lo agotado se muestra al final: sigue visible, pero no estorba.
    return disponibles
      .filter(fn)
      .sort((a, b) => Number(esVendible(b)) - Number(esVendible(a)))
  }, [activeFilter, disponibles])

  return (
    <div>
      {/* Filtros */}
      <div
        role="group"
        aria-label="Filtrar el menú por categoría"
        className="flex gap-2 overflow-x-auto hide-scrollbar px-5 py-4 sm:px-8 lg:flex-wrap lg:overflow-visible lg:px-12"
      >
        {FILTERS.map((f) => (
          <motion.button
            key={f.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(f.id)}
            aria-pressed={activeFilter === f.id}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all duration-150 ${
              activeFilter === f.id
                ? 'bg-primary text-white border-primary shadow-fab'
                : 'bg-white text-app-muted border-app-border hover:border-primary hover:text-primary'
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Conteo. aria-live avisa al lector de pantalla cuando cambia el filtro. */}
      <div className="px-5 mb-3 sm:px-8 lg:px-12">
        <p className="text-xs text-app-muted" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {/* Rejilla: 1 columna en móvil, 2 en tablet, 3 en pantallas grandes */}
      <div className="px-5 sm:px-8 lg:px-12">
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: Math.min(i * 0.04, 0.24) }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🍓</p>
            <p className="text-app-muted font-medium">No hay productos en este filtro</p>
          </div>
        )}
      </div>
    </div>
  )
}
