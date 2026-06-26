'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { products } from '@/lib/data/products'
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

  const filtered = products.filter(filterMap[activeFilter] || (() => true))

  return (
    <div>
      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar px-5 py-4">
        {FILTERS.map((f) => (
          <motion.button
            key={f.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(f.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 ${
              activeFilter === f.id
                ? 'bg-primary text-white border-primary shadow-fab'
                : 'bg-white text-app-muted border-app-border'
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Results count */}
      <div className="px-5 mb-3">
        <p className="text-xs text-app-muted">
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {/* Grid */}
      <div className="px-5 flex flex-col gap-4">
        <motion.div layout className="grid grid-cols-1 gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: i * 0.04 }}
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
