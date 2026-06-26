'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/data/products'
import { openWhatsApp, buildOrderMessage } from '@/lib/utils/whatsapp'
import Badge from '@/components/ui/Badge'
import { ShoppingBag, ArrowRight } from 'lucide-react'

function FeaturedCard({ product, index }) {
  const defaultSize = product.sizes[1] || product.sizes[0]

  const handleOrder = (e) => {
    e.preventDefault()
    const msg = buildOrderMessage({ productName: product.name, size: defaultSize })
    openWhatsApp(msg)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 280, damping: 24 }}
      className="flex-shrink-0 w-[160px]"
    >
      <div className="card-base overflow-hidden">
        {/* Product visual */}
        <div
          className="h-[110px] flex items-center justify-center relative"
          style={{
            background: `linear-gradient(135deg, ${product.colors.from}, ${product.colors.to})`,
          }}
        >
          {product.isNew && (
            <div className="absolute top-2 left-2">
              <Badge type="new">Nuevo</Badge>
            </div>
          )}
          <span className="text-5xl drop-shadow-lg select-none">{product.emoji}</span>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-[11px] text-app-muted font-medium mb-0.5">{product.tagline}</p>
          <h3 className="text-sm font-bold text-app-text leading-tight mb-1">{product.name}</h3>
          <p className="text-primary font-bold text-sm mb-2">
            desde ${product.sizes[0].price}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOrder}
            className="w-full flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-bold py-2 rounded-xl"
          >
            <ShoppingBag size={12} />
            Pedir
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function FeaturedProducts() {
  const featured = getFeaturedProducts()

  return (
    <section className="mt-6 px-5">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-app-text">Más Pedidos 🔥</h2>
          <p className="text-xs text-app-muted">Los favoritos de Acámbaro</p>
        </div>
        <Link
          href="/productos"
          className="flex items-center gap-1 text-primary text-sm font-semibold tap-scale"
        >
          Ver todos
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
        {featured.map((product, i) => (
          <FeaturedCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  )
}
