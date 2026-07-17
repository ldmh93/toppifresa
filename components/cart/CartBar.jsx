'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ChevronUp } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'

export default function CartBar() {
  const cart = useCart()
  if (!cart) return null
  const { itemCount, total, setDrawerOpen, drawerOpen, hydrated } = cart

  const visible = hydrated && itemCount > 0 && !drawerOpen

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={() => setDrawerOpen(true)}
          className="fixed left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[448px] bg-primary text-white rounded-2xl shadow-fab px-4 py-3.5 flex items-center justify-between"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag size={22} />
              <motion.span
                key={itemCount}
                initial={{ scale: 1.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-primary text-[10px] font-black flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            </div>
            <span className="font-bold text-sm">Ver carrito</span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.span
              key={total}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              className="font-black text-base"
            >
              ${total}
            </motion.span>
            <ChevronUp size={18} className="opacity-70" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
