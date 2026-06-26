'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Navigation, Instagram, MessageCircle } from 'lucide-react'
import { openWhatsApp, buildLocationMessage } from '@/lib/utils/whatsapp'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '524611234567'

const schedule = [
  { day: 'Lunes – Viernes', hours: '10:00 AM – 10:00 PM', active: true },
  { day: 'Sábado', hours: '9:00 AM – 11:00 PM', active: true },
  { day: 'Domingo', hours: '10:00 AM – 9:00 PM', active: true },
]

const socials = [
  {
    icon: Instagram,
    label: '@toppifresa',
    color: '#E1306C',
    bg: '#FFF0F5',
    href: 'https://instagram.com/toppifresa',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    color: '#25D366',
    bg: '#F0FFF5',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
]

export default function UbicacionPage() {
  const handleDirections = () => {
    openWhatsApp(buildLocationMessage())
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2ECC71 0%, #27AE60 60%, #1A7A42 100%)' }}
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <MapPin size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-2xl leading-tight">Ubicación</h1>
            <p className="text-white/70 text-sm">Encuéntranos en Acámbaro</p>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="px-5 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden shadow-card h-[200px] relative bg-green-50"
        >
          {/* Embedded Google Maps iframe — replace src with actual embed URL */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29952.45!2d-100.727!3d20.029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842ea0b3cd8f5e37%3A0x0!2sAc%C3%A1mbaro%2C+Gto.!5e0!3m2!1ses!2smx!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Toppifresa - Ubicación en Acámbaro"
          />

          {/* Pin overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ y: [-4, 0, -4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-fab border-4 border-white"
            >
              <span className="text-xl">🍓</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Address card */}
      <div className="px-5 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-base p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-app-text text-sm">Dirección</p>
              <p className="text-app-muted text-sm mt-0.5 leading-relaxed">
                Acámbaro, Guanajuato, México
                <br />
                <span className="text-xs">(Actualiza con tu dirección exacta)</span>
              </p>
            </div>
          </div>

          <div className="h-px bg-app-border my-3" />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleDirections}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-2xl text-sm"
          >
            <Navigation size={18} />
            ¿Cómo llegar? (WhatsApp)
          </motion.button>
        </motion.div>
      </div>

      {/* Schedule */}
      <div className="px-5 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-base p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Clock size={20} className="text-amber-600" />
            </div>
            <p className="font-bold text-app-text text-sm">Horarios de atención</p>
          </div>

          <div className="flex flex-col gap-2">
            {schedule.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-app-muted">{s.day}</span>
                <span className="text-sm font-semibold text-app-text">{s.hours}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl px-3 py-2.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-green-700 text-xs font-semibold">Abierto ahora</p>
          </div>
        </motion.div>
      </div>

      {/* Social links */}
      <div className="px-5 mt-4">
        <h2 className="font-bold text-app-text text-sm mb-3">Síguenos</h2>
        <div className="flex gap-3">
          {socials.map((s) => {
            const Icon = s.icon
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 card-base p-4 flex flex-col items-center gap-2 tap-scale"
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: s.bg }}
                >
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <span className="text-xs font-semibold text-app-text">{s.label}</span>
              </a>
            )
          })}
        </div>
      </div>

      {/* Phone call */}
      <div className="px-5 mt-4">
        <a
          href={`tel:+${WHATSAPP_NUMBER}`}
          className="card-base p-4 flex items-center gap-4 tap-scale block"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Phone size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="font-bold text-app-text text-sm">Llamar directamente</p>
            <p className="text-app-muted text-xs">+52 {WHATSAPP_NUMBER.slice(2)}</p>
          </div>
        </a>
      </div>
    </div>
  )
}
