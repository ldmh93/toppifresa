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
          background: 'linear-gradient(145deg, #D63864 0%, #9B1C40 55%, #1C0A12 100%)',
        }}
      />

      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute top-8 -right-4 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />

      {/* Floating sparkle */}
      <motion.span
        className="absolute bottom-8 right-8 text-xl select-none"
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        ✨
      </motion.span>

      <div className="relative z-10 px-5 pt-14 pb-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/70 text-sm font-medium">📍 Acámbaro, Gto.</p>
          <Link href="/promos" aria-label="Ver promociones">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="relative w-10 h-10 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm"
            >
              <Bell size={20} className="text-white" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary-light border-2 border-[#9B1C40] animate-pulse" />
            </motion.div>
          </Link>
        </div>

        {/* Logo (hasta arriba) */}
        <motion.img
          src="/toppi-logo.svg"
          alt="Toppifresa"
          className="w-full max-w-[300px] mx-auto select-none drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: [-4, 4, -4] }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-white/70 text-sm text-center mb-6"
        >
          Sabores únicos · Toppings premium · Pide por WhatsApp
        </motion.p>

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
