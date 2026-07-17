'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Share2, ChevronDown,
  Plus, Minus, StickyNote, Check, Star,
} from 'lucide-react'
import Image from 'next/image'
import Badge from '@/components/ui/Badge'
import { useCart } from '@/lib/cart/CartContext'

export default function MenuCard({ product, index }) {
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [showNote, setShowNote] = useState(false)
  const [showToppings, setShowToppings] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const { addItem, favorites, toggleFavorite } = useCart()
  const fav = favorites.includes(product.id)

  const total = product.price * quantity

  const handleOrder = () => {
    addItem(product, quantity, note)
    setOrdered(true)
    setQuantity(1)
    setNote('')
    setShowNote(false)
    setTimeout(() => setOrdered(false), 1800)
  }

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `¡Mira este ${product.name} de Toppifresa! ${product.description}`,
          url: window.location.href,
        })
      } catch {}
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
      className="card-base overflow-hidden"
    >
      {/* Visual header */}
      <div
        className="relative h-36 flex items-start justify-between px-5 pt-4 pb-9 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.colors.from}, ${product.colors.to})` }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 right-16 w-16 h-16 rounded-full bg-white/10" />

        {/* Left: badges + name */}
        <div className="relative z-10 flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge>{product.tag}</Badge>
            {product.isNew && <Badge type="new">Nuevo</Badge>}
            {product.popular && (
              <div className="flex items-center gap-1 bg-black/25 backdrop-blur-sm rounded-full px-2 py-0.5">
                <Star size={10} className="text-amber-300 fill-amber-300" />
                <span className="text-white text-[10px] font-bold">Más pedido</span>
              </div>
            )}
          </div>
          <h3 className="text-white font-black text-xl leading-tight drop-shadow">
            {product.name}
          </h3>
          <p className="text-white/70 text-xs mt-0.5 italic">{product.tagline}</p>
        </div>

        {/* Right: emoji or image */}
        <div className="relative z-10 flex-shrink-0 w-20 h-20 flex items-center justify-center">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-2xl"
            />
          ) : (
            <span className="text-6xl drop-shadow-lg select-none">{product.emoji}</span>
          )}
        </div>

        {/* Top-right action buttons */}
        <div className="absolute top-2 right-2 flex gap-1.5">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => toggleFavorite(product.id)}
            className="w-7 h-7 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Star
              size={13}
              className={fav ? 'text-amber-300 fill-amber-300' : 'text-white'}
            />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleShare}
            className="w-7 h-7 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Share2 size={13} className="text-white" />
          </motion.button>
        </div>

        {/* Price pill */}
        <div className="absolute bottom-2 left-5">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1">
            <span className="text-app-text font-black text-sm">
              ${product.price}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Description */}
        <p className="text-app-text/80 text-sm leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Quantity + Total */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 bg-app-bg rounded-2xl p-1.5">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center"
            >
              <Minus size={14} className="text-app-text" />
            </motion.button>
            <span className="font-black text-app-text text-base w-5 text-center">
              {quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-primary shadow-sm flex items-center justify-center"
            >
              <Plus size={14} className="text-white" />
            </motion.button>
          </div>

          <div className="flex-1">
            <p className="text-[11px] text-app-muted font-medium">Total a pagar</p>
            <motion.p
              key={total}
              initial={{ scale: 0.85, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-black text-primary text-xl leading-tight"
            >
              ${total}
            </motion.p>
          </div>

          {/* Toppings toggle */}
          <motion.button
            onClick={() => setShowToppings((v) => !v)}
            className="flex items-center gap-1 text-xs text-app-muted bg-app-bg px-3 py-2 rounded-xl border border-app-border"
          >
            Incluye
            <motion.span animate={{ rotate: showToppings ? 180 : 0 }}>
              <ChevronDown size={12} />
            </motion.span>
          </motion.button>
        </div>

        {/* Toppings expand */}
        <AnimatePresence>
          {showToppings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div className="flex flex-wrap gap-1.5 pb-1 pt-1">
                {product.toppings.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-primary-50 text-primary px-2.5 py-1 rounded-full font-medium border border-primary/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note toggle */}
        <button
          onClick={() => setShowNote((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-app-muted mb-3 tap-scale"
        >
          <StickyNote size={13} />
          {showNote ? 'Quitar nota' : 'Agregar nota especial'}
        </button>

        <AnimatePresence>
          {showNote && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden mb-3"
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej: sin chamoy, extra crema, para llevar..."
                rows={2}
                className="w-full px-3 py-2.5 bg-app-bg border-2 border-app-border rounded-xl text-sm text-app-text outline-none focus:border-primary transition-colors resize-none placeholder:text-app-muted/50"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleOrder}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all duration-300"
          style={{
            background: ordered
              ? '#25D366'
              : `linear-gradient(135deg, ${product.colors.from}, ${product.colors.to})`,
            color: ordered ? '#fff' : product.colors.text,
            boxShadow: ordered
              ? '0 4px 20px rgba(37,211,102,0.4)'
              : `0 4px 20px ${product.colors.from}55`,
          }}
        >
          <AnimatePresence mode="wait">
            {ordered ? (
              <motion.span
                key="ok"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Check size={18} />
                ¡Agregado al carrito!
              </motion.span>
            ) : (
              <motion.span
                key="order"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                Agregar al carrito · ${total}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  )
}
