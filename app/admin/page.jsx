'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ShoppingBag, Sparkles, Tag, Tags, Users, Settings, IceCream2,
  AlertTriangle, Info,
} from 'lucide-react'
import { products, esVendible } from '@/lib/data/products'
import { contarToppings, toppingCategories } from '@/lib/data/toppings'
import { getActivePromos } from '@/lib/data/promos'
import { sabores } from '@/lib/data/sabores'

const accesos = [
  { href: '/admin/productos', label: 'Productos', icon: ShoppingBag, color: '#9C0B0A', bg: '#FDF2F2', desc: 'Precios, fotos, disponibilidad' },
  { href: '/admin/categorias', label: 'Categorías', icon: Tags, color: '#C3201C', bg: '#FDF2F2', desc: 'Etiquetas y orden del menú' },
  { href: '/admin/sabores', label: 'Sabores', icon: IceCream2, color: '#E2787D', bg: '#FDF6F6', desc: 'Opciones y precio adicional' },
  { href: '/admin/toppings', label: 'Toppings', icon: Sparkles, color: '#F8B520', bg: '#FDE5A2', desc: 'Categorías e ingredientes' },
  { href: '/admin/promos', label: 'Promos', icon: Tag, color: '#EB6348', bg: '#FDF6F6', desc: 'Combos y ofertas' },
  { href: '/admin/dinamicas', label: 'Clientes', icon: Users, color: '#2A843F', bg: '#F0FBF2', desc: 'Participantes del sorteo' },
  { href: '/admin/config', label: 'Configuración', icon: Settings, color: '#7C6668', bg: '#F9F6F6', desc: 'WhatsApp, horarios, dirección' },
]

function StatCard({ label, value, sub, icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card"
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl"
        style={{ background: `${color}18` }}
      >
        <span>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black leading-none text-app-text">{value}</p>
        <p className="truncate text-xs text-app-muted">{label}</p>
        {sub && <p className="truncate text-[11px] font-semibold" style={{ color }}>{sub}</p>}
      </div>
    </motion.div>
  )
}

/** Participantes del sorteo. Vive en Supabase, que puede estar caído. */
function Participantes() {
  const [estado, setEstado] = useState({ cargando: true })

  useEffect(() => {
    const control = new AbortController()
    fetch('/admin/api/dinamicas', { signal: control.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => setEstado({ cargando: false, total: d.participantes?.length ?? 0 }))
      .catch((e) => {
        if (e.name !== 'AbortError') setEstado({ cargando: false, error: true })
      })
    return () => control.abort()
  }, [])

  if (estado.cargando) {
    return <StatCard label="Participantes" value="…" icon="👥" color="#2A843F" delay={0.15} />
  }
  if (estado.error) {
    return (
      <StatCard
        label="Participantes"
        value="—"
        sub="Base no disponible"
        icon="👥"
        color="#C3201C"
        delay={0.15}
      />
    )
  }
  return (
    <StatCard
      label="Participantes"
      value={estado.total}
      sub="del sorteo abierto"
      icon="👥"
      color="#2A843F"
      delay={0.15}
    />
  )
}

export default function AdminDashboard() {
  const agotados = products.filter((p) => !esVendible(p))
  const promosActivas = getActivePromos().length
  const saboresActivos = sabores.filter((s) => s.activo).length

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-black text-app-text">Dashboard 🍓</h1>
        <p className="text-sm text-app-muted">Panel de administración de Toppifresa</p>
      </div>

      {/* Cómo funciona este panel. Antes aquí había un aviso de Firebase que
          llevaba meses sin significar nada: Firebase se quitó del proyecto. */}
      <div className="mb-5 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-0.5 flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-bold text-primary-900">El menú vive en el código</p>
            <p className="mt-0.5 text-xs leading-relaxed text-primary-800">
              Aquí puedes editar todo con comodidad y el panel te entrega el bloque listo para
              pegar en el archivo. Tus cambios se guardan como borrador en este navegador hasta
              que los publiques.
            </p>
          </div>
        </div>
      </div>

      {agotados.length > 0 && (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-800">
              <strong className="font-bold">
                {agotados.length} producto{agotados.length > 1 ? 's' : ''} sin vender:
              </strong>{' '}
              {agotados.map((p) => p.name).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* Números reales, calculados del catálogo. */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <StatCard
          label="Productos"
          value={products.length}
          sub={agotados.length ? `${agotados.length} sin vender` : 'todos activos'}
          icon="🍓"
          color="#9C0B0A"
          delay={0.05}
        />
        <StatCard
          label="Promos activas"
          value={promosActivas}
          icon="🎉"
          color="#EB6348"
          delay={0.1}
        />
        <Participantes />
        <StatCard
          label="Toppings"
          value={contarToppings()}
          sub={`${toppingCategories.length} categorías`}
          icon="✨"
          color="#F8B520"
          delay={0.2}
        />
        <StatCard
          label="Sabores"
          value={saboresActivos}
          sub="disponibles"
          icon="🍨"
          color="#E2787D"
          delay={0.25}
        />
      </div>

      <h2 className="mb-3 text-base font-bold text-app-text">Gestionar contenido</h2>
      <div className="mb-6 flex flex-col gap-3">
        {accesos.map((link, i) => {
          const Icon = link.icon
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link
                href={link.href}
                className="tap-scale flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card"
              >
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: link.bg }}
                >
                  <Icon size={22} style={{ color: link.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-app-text">{link.label}</p>
                  <p className="text-xs text-app-muted">{link.desc}</p>
                </div>
                <span className="text-xl font-light text-app-muted" aria-hidden="true">
                  ›
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-primary p-4">
        <div>
          <p className="text-sm font-bold text-white">Ver la app pública</p>
          <p className="text-xs text-white/70">Como la ven tus clientes</p>
        </div>
        <Link href="/" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary">
          Abrir →
        </Link>
      </div>
    </div>
  )
}
