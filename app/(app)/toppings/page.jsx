'use client'

import { motion } from 'framer-motion'
import { getCategoriasPublicas, contarToppings } from '@/lib/data/toppings'
import { getProductosPublicos } from '@/lib/data/products'
import { Sparkles } from 'lucide-react'

function ToppingChip({ topping, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 24 }}
      className="inline-flex items-center gap-1.5 bg-white border border-app-border shadow-sm px-3 py-2 rounded-full"
    >
      <span className="text-base">{topping.emoji}</span>
      <span className="text-sm font-medium text-app-text">{topping.name}</span>
    </motion.div>
  )
}

function ToppingCategory({ category, globalIndex }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: globalIndex * 0.06 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${category.color}20` }}
        >
          {category.emoji}
        </div>
        <h2 className="font-bold text-app-text text-base">{category.name}</h2>
        <span className="text-xs text-app-muted">({category.items.length})</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {category.items.map((topping, i) => (
          <ToppingChip
            key={topping.id}
            topping={topping}
            delay={globalIndex * 0.06 + i * 0.04}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function ToppingsPage() {
  const categorias = getCategoriasPublicas()

  return (
    <div className="pb-4">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-8 relative overflow-hidden sm:px-8 lg:px-12"
        style={{ background: 'linear-gradient(160deg, #B5191A 0%, #6B0306 100%)' }}
      >
        <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 left-8 w-20 h-20 rounded-full bg-white/10" />

        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-2xl leading-tight">Toppings</h1>
            <p className="text-white/70 text-sm">Todo lo que ponemos en tus fresas</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 relative z-10">
          {[
            { n: categorias.length, label: 'Categorías' },
            {
              n: contarToppings(),
              label: 'Toppings',
            },
            { n: getProductosPublicos().length, label: 'Sabores' },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-white font-black text-xl">{stat.n}</p>
              <p className="text-white/70 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="px-5 mt-4 mb-6">
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 flex gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-primary-900 text-sm font-medium">
            Solo puedes escoger <span className="font-black">2 toppings por producto</span>. Elige tus favoritos y personalízalo por WhatsApp.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5">
        {categorias.map((category, i) => (
          <ToppingCategory key={category.id} category={category} globalIndex={i} />
        ))}
      </div>
    </div>
  )
}
