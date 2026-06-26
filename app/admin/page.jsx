'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, Sparkles, Tag, Users, Settings, AlertCircle, CheckCircle2 } from 'lucide-react'
import { products as staticProducts } from '@/lib/data/products'

const quickLinks = [
  { href: '/admin/productos', label: 'Gestionar Productos', icon: ShoppingBag, color: '#D63864', bg: '#FFF0F3', desc: 'Precios, fotos, descripciones' },
  { href: '/admin/toppings', label: 'Gestionar Toppings', icon: Sparkles, color: '#A855F7', bg: '#F5F0FF', desc: 'Categorías e ingredientes' },
  { href: '/admin/promos', label: 'Gestionar Promos', icon: Tag, color: '#F5B731', bg: '#FFFBEB', desc: 'Ofertas y campañas' },
  { href: '/admin/dinamicas', label: 'Ver Clientes', icon: Users, color: '#25D366', bg: '#F0FFF5', desc: 'Participantes del sorteo' },
  { href: '/admin/config', label: 'Configuración', icon: Settings, color: '#6B7280', bg: '#F9FAFB', desc: 'WhatsApp, horarios, dirección' },
]

function StatCard({ label, value, icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${color}15` }}>
        <span>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-black text-app-text">{value}</p>
        <p className="text-xs text-app-muted">{label}</p>
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const firebaseOk = !!(
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your-api-key'
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-app-text">Dashboard 🍓</h1>
        <p className="text-app-muted text-sm">Panel de administración Toppifresa</p>
      </div>

      {/* Firebase status */}
      {firebaseOk ? (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-5">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <p className="text-emerald-700 text-sm font-medium">Firebase conectado — sincronización activa</p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-700 text-sm font-semibold">Firebase no configurado</p>
              <p className="text-amber-600 text-xs mt-0.5">
                Configura <code className="bg-amber-100 px-1 rounded">.env.local</code> con tus credenciales. Mostrando datos estáticos por ahora.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Productos" value={staticProducts.length} icon="🍓" color="#D63864" delay={0.05} />
        <StatCard label="Promos activas" value="5" icon="🎉" color="#F5B731" delay={0.1} />
        <StatCard label="Participantes" value="—" icon="👥" color="#25D366" delay={0.15} />
        <StatCard label="Toppings" value="25+" icon="✨" color="#A855F7" delay={0.2} />
      </div>

      {/* Quick links */}
      <h2 className="font-bold text-app-text text-base mb-3">Gestionar contenido</h2>
      <div className="flex flex-col gap-3 mb-6">
        {quickLinks.map((link, i) => {
          const Icon = link.icon
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <Link href={link.href} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card tap-scale">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: link.bg }}>
                  <Icon size={22} style={{ color: link.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-app-text text-sm">{link.label}</p>
                  <p className="text-app-muted text-xs">{link.desc}</p>
                </div>
                <span className="text-app-muted text-xl font-light">›</span>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* View app */}
      <div className="bg-primary rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">Ver la app pública</p>
          <p className="text-white/70 text-xs">Como la ven tus clientes</p>
        </div>
        <Link href="/" className="bg-white text-primary font-bold text-sm px-4 py-2 rounded-xl">
          Abrir →
        </Link>
      </div>
    </div>
  )
}
