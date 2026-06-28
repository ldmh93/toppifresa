"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardLayout from "@/components/DashboardLayout"
import { getCitas, saveCitas } from "@/lib/storage"
import { SERVICES } from "@/lib/pricing"

const ESTADOS = ["pendiente", "confirmada", "completada", "cancelada"]

const STATUS_CLS = {
  pendiente:  "bg-amber-500/15  text-amber-400  border-amber-500/25",
  confirmada: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  completada: "bg-blue-500/15   text-blue-400   border-blue-500/25",
  cancelada:  "bg-red-500/15    text-red-400    border-red-500/25",
}

const BLANK = { cliente: "", servicio: "Full Set", fecha: "", hora: "10:00", estado: "pendiente" }

function toGoogleCalUrl(cita) {
  const [h] = cita.hora.split(":")
  const endH = String(Math.min(parseInt(h) + 2, 23)).padStart(2, "0")
  const min  = cita.hora.split(":")[1] ?? "00"
  const fmt  = (s) => s.replace(/[-:]/g, "")
  const start = fmt(`${cita.fecha}T${cita.hora}:00`)
  const end   = fmt(`${cita.fecha}T${endH}:${min}:00`)
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text:    `Nail Studio — ${cita.cliente}`,
    details: `Servicio: ${cita.servicio}`,
    dates:   `${start}/${end}`,
  })
  return `https://calendar.google.com/calendar/render?${p}`
}

export default function AgendaPage() {
  const [citas,    setCitas]    = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState(BLANK)
  const [date,     setDate]     = useState(new Date().toISOString().split("T")[0])

  useEffect(() => { setCitas(getCitas()) }, [])

  const save = (list) => { setCitas(list); saveCitas(list) }

  const addCita = () => {
    if (!form.cliente.trim() || !form.fecha) return
    save([...citas, { ...form, id: Date.now().toString() }])
    setForm(BLANK)
    setShowForm(false)
  }

  const del = (id) => save(citas.filter((c) => c.id !== id))

  const setEstado = (id, estado) =>
    save(citas.map((c) => (c.id === id ? { ...c, estado } : c)))

  const visible = [...citas]
    .filter((c) => !date || c.fecha === date)
    .sort((a, b) => a.hora.localeCompare(b.hora))

  const dateLabel = date
    ? new Date(date + "T12:00:00").toLocaleDateString("es-MX", {
        weekday: "long", day: "numeric", month: "long",
      })
    : "Todas las citas"

  return (
    <DashboardLayout title="Agenda">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-[#d4af37] hover:bg-[#b8962e] text-black font-bold rounded-xl text-sm transition-colors"
          >
            + Nueva Cita
          </motion.button>
          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-3 bg-white/5 border border-white/10 hover:border-[#d4af37]/25 text-gray-300 rounded-xl text-sm text-center transition-all"
          >
            📅 Google Calendar
          </a>
        </div>

        {/* New cita form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.97, y: -8  }}
              className="bg-[#111] border border-[#d4af37]/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold">Nueva Cita</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white text-xl w-8 h-8 flex items-center justify-center">✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Field label="Cliente" value={form.cliente} onChange={(v) => setForm((p) => ({ ...p, cliente: v }))} placeholder="Nombre del cliente" />
                <div>
                  <label className="text-gray-400 text-xs font-medium block mb-1.5">Servicio</label>
                  <select
                    value={form.servicio}
                    onChange={(e) => setForm((p) => ({ ...p, servicio: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
                  >
                    {Object.values(SERVICES).map((s) => (
                      <option key={s.label} value={s.label}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <Field label="Fecha" type="date" value={form.fecha} onChange={(v) => setForm((p) => ({ ...p, fecha: v }))} />
                <Field label="Hora"  type="time" value={form.hora}  onChange={(v) => setForm((p) => ({ ...p, hora:  v }))} />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addCita}
                  disabled={!form.cliente.trim() || !form.fecha}
                  className="flex-1 py-3 bg-[#d4af37] hover:bg-[#b8962e] disabled:opacity-40 text-black font-bold rounded-xl text-sm transition-colors"
                >
                  Guardar Cita
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 bg-white/5 text-gray-400 hover:bg-white/8 rounded-xl text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Citas list */}
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-bold capitalize">{dateLabel}</h2>
            <span className="text-gray-600 text-xs">{visible.length} citas</span>
          </div>

          {visible.length === 0 ? (
            <div className="py-16 text-center text-gray-600">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-sm mb-2">No hay citas para este día</p>
              <button onClick={() => setShowForm(true)} className="text-[#d4af37] text-xs hover:underline">
                + Agendar ahora
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/4">
              {visible.map((cita, i) => (
                <motion.div
                  key={cita.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: i * 0.05 } }}
                  className="flex items-center gap-4 px-5 py-4 group hover:bg-white/2 transition-colors"
                >
                  {/* Time */}
                  <div className="w-14 shrink-0 text-center">
                    <p className="text-[#d4af37] font-black text-sm">{cita.hora}</p>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{cita.cliente}</p>
                    <p className="text-gray-500 text-xs">{cita.servicio}</p>
                  </div>

                  {/* Estado select */}
                  <select
                    value={cita.estado}
                    onChange={(e) => setEstado(cita.id, e.target.value)}
                    className={`text-xs px-2.5 py-1.5 rounded-full border font-medium bg-transparent cursor-pointer focus:outline-none ${STATUS_CLS[cita.estado] ?? ""}`}
                  >
                    {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>

                  {/* Actions (visible on hover) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={toGoogleCalUrl(cita)}
                      target="_blank"
                      rel="noreferrer"
                      title="Agregar a Google Calendar"
                      className="p-1.5 rounded-lg text-gray-600 hover:text-[#d4af37] hover:bg-[#d4af37]/8 transition-all text-sm"
                    >
                      📅
                    </a>
                    <button
                      onClick={() => del(cita.id)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/8 transition-all text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Tip */}
        <p className="text-center text-gray-700 text-xs pb-4">
          Toca el ícono 📅 en cada cita para agregarla a Google Calendar
        </p>
      </div>
    </DashboardLayout>
  )
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-gray-400 text-xs font-medium block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/50 transition-colors"
      />
    </div>
  )
}
