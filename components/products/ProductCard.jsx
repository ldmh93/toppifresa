'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { MessageCircle, ChevronDown, Check } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { buildOrderMessage, openWhatsApp } from '@/lib/utils/whatsapp'

export default function ProductCard({ product }) {
  const [expanded, setExpanded] = useState(false)
  const [ordered, setOrdered] = useState(false)

  const handleOrder = () => {
    const msg = buildOrderMessage({ productName: product.name, price: product.price })
    openWhatsApp(msg)
    setOrdered(true)
    setTimeout(() => setOrdered(false), 2500)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-base overflow-hidden"
    >
      {/* Visual header */}
      <div
        className="relative h-[140px] flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${product.colors.from}, ${product.colors.to})` }}
      >
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
          <Badge>{product.tag}</Badge>
          {product.isNew && <Badge type="new">Nuevo</Badge>}
        </div>

        {/* Toppings preview */}
        <div className="absolute bottom-2 right-2">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl px-2 py-1">
            <p className="text-white/90 text-[10px] font-medium">
              {product.toppings.slice(0, 2).join(' · ')}
              {product.toppings.length > 2 ? ` +${product.toppings.length - 2}` : ''}
            </p>
          </div>
        </div>

        {/* Emoji */}
        <span className="text-[64px] drop-shadow-lg select-none">{product.emoji}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-app-text text-base leading-tight">{product.name}</h3>
          <span className="text-primary font-black text-lg ml-2 flex-shrink-0">
            ${product.price}
          </span>
        </div>

        <p className="text-app-muted text-xs mb-3 leading-relaxed">{product.description}</p>

        {/* Toppings expand */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-app-muted mb-3 tap-scale"
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
          </motion.div>
          Ver toppings incluidos
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-3"
            >
              <div className="flex flex-wrap gap-1.5 pb-1">
                {product.toppings.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-primary-50 text-primary px-2.5 py-1 rounded-full font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleOrder}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200"
          style={{
            background: ordered ? '#25D366' : `linear-gradient(135deg, ${product.colors.from}, ${product.colors.to})`,
            color: product.colors.text,
          }}
        >
          <AnimatePresence mode="wait">
            {ordered ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Check size={18} />
                ¡Pedido enviado!
              </motion.div>
            ) : (
              <motion.div
                key="order"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <MessageCircle size={18} />
                Pedir por WhatsApp — ${product.price}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  )
}
