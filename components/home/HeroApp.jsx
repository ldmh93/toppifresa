'use client'

import { motion } from 'framer-motion'
import { Bell, Search } from 'lucide-react'
import Link from 'next/link'

export default function HeroApp() {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(145deg, #b5191a 0%, #4b100d 60%, #150c09 100%)',
        }}
      />

      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute top-8 -right-4 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />

      {/* Floating strawberry emojis */}
      <motion.span
        className="absolute top-12 right-12 text-3xl select-none"
        animate={{ y: [-4, 4, -4], rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        🍓
      </motion.span>
      <motion.span
        className="absolute top-6 right-32 text-2xl select-none"
        animate={{ y: [4, -4, 4], rotate: [5, -5, 5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        🍦
      </motion.span>
      <motion.span
        className="absolute bottom-8 right-8 text-xl select-none"
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        ✨
      </motion.span>

      <div className="relative z-10 px-5 pt-14 pb-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm font-medium">📍 Acámbaro, Gto.</p>
            <img
              src="/logo-white.svg"
              alt="Toppifresa"
              className="h-10 mt-0.5 w-auto"
              draggable={false}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm"
          >
            <Bell size={20} className="text-white" />
          </motion.button>
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-white font-black text-3xl leading-tight mb-1">
            Fresas con Crema
            <br />
            <span style={{ color: '#ff7bac' }}>que enamoran</span>
          </h2>
          <p className="text-white/60 text-xs italic mb-1">Tu dosis de felicidad diaria ✨</p>
          <p className="text-white/70 text-sm">
            10 sabores únicos · Toppings premium · Pide por WhatsApp
          </p>
        </motion.div>

        {/* Search bar (decorative / links to productos) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link href="/productos">
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
              <Search size={18} className="text-white/70" />
              <span className="text-white/60 text-sm">Buscar tu Toppi favorito...</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
