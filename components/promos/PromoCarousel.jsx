'use client'

import { motion, useAnimationControls } from 'framer-motion'
import { useRef, useState } from 'react'
import { getActivePromos } from '@/lib/data/promos'
import { openWhatsApp, buildPromoMessage } from '@/lib/utils/whatsapp'
import { Zap, Clock } from 'lucide-react'
import Badge from '@/components/ui/Badge'

function PromoCard({ promo, index }) {
  const handleCTA = () => {
    openWhatsApp(buildPromoMessage(promo.whatsappMsg))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 280, damping: 24 }}
      className="flex-shrink-0 w-[300px] rounded-3xl overflow-hidden relative"
      style={{
        background: `linear-gradient(145deg, ${promo.colors.from}, ${promo.colors.to})`,
        minHeight: '200px',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10" />

      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <Badge type={promo.tag === 'HOY' ? 'hot' : 'promo'}>{promo.tag}</Badge>
          <span className="text-4xl">{promo.emoji}</span>
        </div>

        {/* Content */}
        <div className="mt-3">
          <h3 className="text-white font-black text-xl leading-tight mb-1">{promo.title}</h3>
          <p className="text-white/80 text-sm font-medium mb-1">{promo.subtitle}</p>
          <p className="text-white/60 text-xs leading-relaxed mb-4">{promo.description}</p>
        </div>

        {/* Urgency + CTA */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Clock size={12} className="text-white/70" />
            <span className="text-white/70 text-xs font-medium">{promo.urgency}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCTA}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm"
            style={{
              background: promo.colors.accent || 'rgba(255,255,255,0.2)',
              color: promo.colors.accent ? '#1C1C1E' : 'white',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Zap size={16} />
            {promo.cta}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function PromoCarousel() {
  const promos = getActivePromos()

  return (
    <section className="mt-2">
      {/* Urgency header */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <span className="text-xl">⚡</span>
          <div>
            <p className="text-amber-700 font-bold text-sm">Ofertas por tiempo limitado</p>
            <p className="text-amber-600 text-xs">No te quedes sin aprovecharlas</p>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5 pb-4">
        {promos.map((promo, i) => (
          <PromoCard key={promo.id} promo={promo} index={i} />
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-2">
        {promos.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === 0 ? 'w-4 bg-primary' : 'w-1.5 bg-primary/30'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
