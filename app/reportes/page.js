"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardLayout from "@/components/DashboardLayout"
import { getVentas, saveVentas } from "@/lib/storage"
import { SERVICES } from "@/lib/pricing"

const BLANK = {
  cliente:  "",
  servicio: "Full Set",
  monto:    "",
  fecha:    new Date().toISOString().split("T")[0],
}

export default function ReportesPage() {
  const [ventas,   setVentas]   = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState(BLANK)

  useEffect(() => { setVentas(getVentas()) }, [])

  const save = (list) => { setVentas(list); saveVentas(list) }

  const add = () => {
    if (!form.monto || !form.cliente.trim()) return
    save([...ventas, { ...form, id: Date.now().toString(), monto: parseInt(form.monto) }])
    setForm({ ...BLANK, fecha: form.fecha })
    setShowForm(false)
  }

  const del = (id) => save(ventas.filter((v) => v.id !== id))

  // ── Stats ────────────────────────────────────────────────
  const today    = new Date().toISOString().split("T")[0]
  const hoy      = ventas.filter((v) => v.fecha === today)
  const ganHoy   = hoy.reduce((s, v) => s + v.monto, 0)
  const total    = ventas.reduce((s, v) => s + v.monto, 0)
  const promedio = ventas.length ? Math.round(total / ventas.length) : 0

  // Service breakdown
  const byService = {}
  ventas.forEach((v) => { byService[v.servicio] = (byService[v.servicio] || 0) + v.monto })
  const serviceRows = Object.entries(byService).sort((a, b) => b[1] - a[1])
  const maxSvc = serviceRows[0]?.[1] || 1

  // Last 7 days bar chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const ds  = d.toISOString().split("T")[0]
    const sum = ventas.filter((v) => v.fecha === ds).reduce((s, v) => s + v.monto, 0)
    return { ds, day: d.toLocaleDateString("es-MX", { weekday: "short" }), sum }
  })
  const maxDay = Math.max(...last7.map((d) => d.sum), 1)

  return (
    <DashboardLayout title="Reportes">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Ganancias de hoy",  value: `$${ganHoy}`,  sub: `${hoy.length} servicios`,       color: "#d4af37" },
            { label: "Total acumulado",    value: `$${total}`,   sub: `${ventas.length} ventas totales`, color: "#a78bfa" },
            { label: "Ticket promedio",    value: `$${promedio}`, sub: "por servicio",                  color: "#34d399" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }}
              className="bg-[#111] border border-white/5 rounded-2xl p-5"
            >
              <p className="text-gray-500 text-xs mb-3">{s.label}</p>
              <p className="text-3xl font-black leading-none mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-600 text-xs">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Bar chart – 7 días */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.28 } }}
            className="bg-[#111] border border-white/5 rounded-2xl p-5"
          >
            <h2 className="text-white font-bold mb-6">Últimos 7 días</h2>
            <div className="flex items-end gap-2 h-28">
              {last7.map((d, i) => {
                const pct = maxDay > 0 ? (d.sum / maxDay) * 100 : 0
                const isToday = d.ds === today
                return (
                  <div key={d.ds} className="flex-1 flex flex-col items-center gap-1.5">
                    {d.sum > 0 && (
                      <span className="text-[9px] text-gray-500">${d.sum}</span>
                    )}
                    <div className="w-full flex items-end" style={{ height: "80px" }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(pct, 4)}%` }}
                        transition={{ delay: 0.35 + i * 0.06, duration: 0.5 }}
                        className="w-full rounded-t-lg"
                        style={{
                          background: isToday
                            ? "linear-gradient(to top, #b8962e, #f5d76e)"
                            : "rgba(212,175,55,0.18)",
                        }}
                      />
                    </div>
                    <span className={`text-[10px] capitalize ${isToday ? "text-[#d4af37] font-bold" : "text-gray-600"}`}>
                      {d.day}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Service breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.36 } }}
            className="bg-[#111] border border-white/5 rounded-2xl p-5"
          >
            <h2 className="text-white font-bold mb-5">Ingresos por servicio</h2>
            {serviceRows.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-8">Sin datos aún</p>
            ) : (
              <div className="space-y-4">
                {serviceRows.map(([name, amt], i) => (
                  <div key={name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-gray-300">{name}</span>
                      <span className="text-[#d4af37] font-bold">${amt}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(amt / maxSvc) * 100}%` }}
                        transition={{ delay: 0.45 + i * 0.08, duration: 0.6 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8962e]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent sales + add */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.45 } }}
          className="bg-[#111] border border-white/5 rounded-2xl"
        >
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-bold">Ventas registradas</h2>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="px-4 py-2 bg-[#d4af37] hover:bg-[#b8962e] text-black font-bold rounded-xl text-xs transition-colors"
            >
              {showForm ? "Cancelar" : "+ Registrar venta"}
            </button>
          </div>

          {/* Add-sale form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{   opacity: 0, height: 0     }}
                style={{ overflow: "hidden" }}
              >
                <div className="p-5 border-b border-white/5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <input
                      value={form.cliente}
                      onChange={(e) => setForm((p) => ({ ...p, cliente: e.target.value }))}
                      placeholder="Cliente *"
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/50"
                    />
                    <select
                      value={form.servicio}
                      onChange={(e) => setForm((p) => ({ ...p, servicio: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
                    >
                      {Object.values(SERVICES).map((s) => (
                        <option key={s.label} value={s.label}>{s.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={form.monto}
                      onChange={(e) => setForm((p) => ({ ...p, monto: e.target.value }))}
                      placeholder="Monto $ *"
                      min="0"
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/50"
                    />
                    <input
                      type="date"
                      value={form.fecha}
                      onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
                    />
                  </div>
                  <button
                    onClick={add}
                    disabled={!form.monto || !form.cliente.trim()}
                    className="w-full py-3 bg-[#d4af37] hover:bg-[#b8962e] disabled:opacity-40 text-black font-bold rounded-xl text-sm transition-colors"
                  >
                    Guardar Venta
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          {ventas.length === 0 ? (
            <div className="py-12 text-center text-gray-600">
              <p className="text-4xl mb-2">📊</p>
              <p className="text-sm">No hay ventas registradas aún</p>
            </div>
          ) : (
            <div className="divide-y divide-white/4">
              {[...ventas].reverse().slice(0, 20).map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: i * 0.03 } }}
                  className="flex items-center gap-4 px-5 py-3.5 group hover:bg-white/2 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{v.cliente}</p>
                    <p className="text-gray-500 text-xs">{v.servicio}</p>
                  </div>
                  <p className="text-[#d4af37] font-bold text-sm shrink-0">${v.monto}</p>
                  <p className="text-gray-600 text-xs shrink-0">
                    {new Date(v.fecha + "T12:00:00").toLocaleDateString("es-MX", {
                      day: "numeric", month: "short",
                    })}
                  </p>
                  <button
                    onClick={() => del(v.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400 text-xs px-1"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
