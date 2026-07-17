'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart/CartContext'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '524439425620'

const quickMessages = [
  { label: '🍓 Ver carta completa', text: 'Hola! Quiero ver la carta completa de Toppifresa 🍓' },
  { label: '🎉 ¿Hay promos hoy?', text: 'Hola! ¿Qué promos tienen disponibles hoy? 🎉' },
  { label: '📍 ¿A qué hora abren?', text: 'Hola! ¿Cuál es el horario y la dirección de Toppifresa? 📍' },
  { label: '🛵 ¿Hacen envíos?', text: 'Hola! ¿Hacen entregas a domicilio en Acámbaro? 🛵' },
]

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)
  const cart = useCart()
  // Sube el botón cuando la barra del carrito está visible para no encimarse
  const cartBarVisible = cart?.hydrated && cart.itemCount > 0 && !cart.drawerOpen
  const fabBottom = cartBarVisible ? 148 : 88
  const panelBottom = cartBarVisible ? 208 : 148

  const sendMessage = (text) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Quick messages panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed z-50 flex flex-col gap-2 max-w-[240px]"
            style={{
              bottom: `calc(env(safe-area-inset-bottom, 0px) + ${panelBottom}px)`,
              right: 'max(1rem, calc(50% - 224px))',
            }}
          >
            <div className="bg-white rounded-2xl shadow-card-hover p-3 mb-2">
              <p className="text-xs font-semibold text-app-muted mb-2">Mensajes rápidos</p>
              <div className="flex flex-col gap-2">
                {quickMessages.map((msg, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => sendMessage(msg.text)}
                    className="text-left text-sm bg-primary-50 text-primary font-medium px-3 py-2.5 rounded-xl tap-scale hover:bg-primary-100 transition-colors"
                  >
                    {msg.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 w-14 h-14 rounded-full shadow-fab tap-scale flex items-center justify-center"
        style={{
          bottom: `calc(env(safe-area-inset-bottom, 0px) + ${fabBottom}px)`,
          right: 'max(1rem, calc(50% - 224px))',
          background: open ? '#1C1C1E' : '#25D366',
        }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="wa"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <MessageCircle size={26} className="text-white" fill="white" strokeWidth={0} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
