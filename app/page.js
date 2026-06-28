"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import DashboardLayout from "@/components/DashboardLayout"
import { getVentas, getCitas, getClientes, seedDemoData } from "@/lib/storage"

const CARD_ANIM = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ ganHoy: 0, citasHoy: 0, clientes: 0, promedio: 0 })
  const [citasDeHoy, setCitasDeHoy] = useState([])
  const [topServicios, setTopServicios] = useState([])

  useEffect(() => {
    seedDemoData()

    const ventas   = getVentas()
    const citas    = getCitas()
    const clientes = getClientes()
    const today    = new Date().toISOString().split("T")[0]

    const ventasHoy = ventas.filter((v) => v.fecha === today)
    const ganHoy    = ventasHoy.reduce((s, v) => s + v.monto, 0)
    const promedio  = ventas.length ? Math.round(ventas.reduce((s, v) => s + v.monto, 0) / ventas.length) : 0

    // Top servicios
    const counts = {}
    ventas.forEach((v) => { counts[v.servicio] = (counts[v.servicio] || 0) + 1 })
    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, count }))

    setStats({ ganHoy, citasHoy: citas.filter((c) => c.fecha === today).length, clientes: clientes.length, promedio })
    setCitasDeHoy(citas.filter((c) => c.fecha === today).sort((a, b) => a.hora.localeCompare(b.hora)))
    setTopServicios(top)
  }, [])

  const STATS_CARDS = [
    { label: "Ganancias hoy",    value: `$${stats.ganHoy}`,    badge: "MXN",          icon: "💰", color: "#d4af37" },
    { label: "Citas hoy",        value: stats.citasHoy,        badge: "agendadas",    icon: "📅", color: "#a78bfa" },
    { label: "Clientas",         value: stats.clientes,        badge: "registradas",  icon: "👩‍💼", color: "#34d399" },
    { label: "Ticket promedio",  value: `$${stats.promedio}`,  badge: "MXN",          icon: "📊", color: "#f87171" },
  ]

  const STATUS_CLS = {
    confirmada: "bg-emerald-500/15 text-emerald-400",
    pendiente:  "bg-amber-500/15  text-amber-400",
    completada: "bg-blue-500/15   text-blue-400",
    cancelada:  "bg-red-500/15    text-red-400",
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {STATS_CARDS.map((c, i) => (
          <motion.div
            key={c.label}
            custom={i}
            initial="hidden"
            animate="show"
            variants={CARD_ANIM}
            className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-[#d4af37]/25 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{c.icon}</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: c.color + "18", color: c.color }}
              >
                {c.badge}
              </span>
            </div>
            <p className="text-2xl font-black text-white mb-0.5 leading-none">{c.value}</p>
            <p className="text-gray-500 text-xs mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Citas de hoy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.32 } }}
          className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl"
        >
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-bold">Citas de hoy</h3>
            <Link href="/agenda" className="text-[#d4af37] text-xs hover:underline">Ver agenda →</Link>
          </div>

          {citasDeHoy.length === 0 ? (
            <div className="py-14 text-center text-gray-600">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-sm mb-2">No hay citas para hoy</p>
              <Link href="/agenda" className="text-[#d4af37] text-xs hover:underline">+ Agendar cita</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/4">
              {citasDeHoy.map((cita, i) => (
                <motion.div
                  key={cita.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.4 + i * 0.07 } }}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="w-14 shrink-0 text-center">
                    <p className="text-[#d4af37] font-black text-sm">{cita.hora}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{cita.cliente}</p>
                    <p className="text-gray-500 text-xs">{cita.servicio}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CLS[cita.estado] ?? ""}`}>
                    {cita.estado}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="bg-[#111] border border-white/5 rounded-2xl p-5"
          >
            <h3 className="text-white font-bold mb-4">Acciones rápidas</h3>
            <div className="space-y-1.5">
              {[
                { href: "/calculator", icon: "💅", label: "Nueva cotización" },
                { href: "/agenda",     icon: "📅", label: "Agendar cita"     },
                { href: "/clientes",   icon: "👩‍💼", label: "Ver clientas"    },
                { href: "/reportes",   icon: "📊", label: "Ver reportes"     },
              ].map((a) => (
                <Link key={a.href} href={a.href}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#d4af37]/8 border border-transparent hover:border-[#d4af37]/18 transition-all cursor-pointer group">
                    <span className="text-lg">{a.icon}</span>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{a.label}</span>
                    <span className="ml-auto text-gray-600 group-hover:text-[#d4af37] text-sm transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Top servicios */}
          {topServicios.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
              className="bg-[#111] border border-white/5 rounded-2xl p-5"
            >
              <h3 className="text-white font-bold mb-4">Servicios top</h3>
              <div className="space-y-3">
                {topServicios.map((s, i) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-400">{s.name}</span>
                      <span className="text-[#d4af37] font-bold">{s.count}×</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.count / (topServicios[0]?.count || 1)) * 100}%` }}
                        transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8962e]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
