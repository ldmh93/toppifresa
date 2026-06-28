"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardLayout from "@/components/DashboardLayout"
import {
  SERVICES, SHAPES, LENGTHS, EXTRAS,
  calculateTotal, buildWhatsAppMessage, WHATSAPP_NUMBER,
} from "@/lib/pricing"

export default function CalculatorPage() {
  const [service, setService] = useState("fullset")
  const [shape,   setShape]   = useState("cuadrada")
  const [length,  setLength]  = useState("m")
  const [extras,  setExtras]  = useState([])
  const [name,    setName]    = useState("")
  const [total,   setTotal]   = useState(0)
  const [sent,    setSent]    = useState(false)

  useEffect(() => {
    setTotal(calculateTotal({ service, shape, length, extras }))
  }, [service, shape, length, extras])

  const toggleExtra = (key) =>
    setExtras((prev) => prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key])

  const handleWhatsApp = () => {
    const msg = buildWhatsAppMessage({ service, shape, length, extras, total, clientName: name })
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank")
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <DashboardLayout title="Cotizador de Uñas">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Price hero */}
        <motion.div
          layout
          className="rounded-2xl border border-[#d4af37]/35 bg-gradient-to-br from-[#1a1400] via-[#111] to-[#0d0d0d] p-7 text-center"
        >
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Total de la cotización</p>
          <motion.p
            key={total}
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1,    opacity: 1     }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-7xl font-black leading-none mb-2"
            style={{ color: "#d4af37" }}
          >
            ${total}
          </motion.p>
          <p className="text-gray-600 text-sm">MXN</p>

          {/* Summary chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            <Chip color="gold"   label={SERVICES[service]?.label} />
            <Chip color="gray"   label={SHAPES[shape]?.label}     />
            <Chip color="gray"   label={`Long. ${LENGTHS[length]?.label}`} />
            {extras.map((e) => <Chip key={e} color="purple" label={EXTRAS[e]?.label} />)}
          </div>
        </motion.div>

        {/* 1 — Servicio */}
        <Section step="1" title="Tipo de Servicio">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(SERVICES).map(([k, v]) => (
              <OptionBtn
                key={k}
                active={service === k}
                onClick={() => setService(k)}
                label={v.label}
                sub={`Desde $${v.base}`}
              />
            ))}
          </div>
        </Section>

        {/* 2 — Forma */}
        <Section step="2" title="Forma de Uñas">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(SHAPES).map(([k, v]) => (
              <OptionBtn
                key={k}
                active={shape === k}
                onClick={() => setShape(k)}
                label={v.label}
                sub={v.extra > 0 ? `+$${v.extra}` : "Incluido"}
              />
            ))}
          </div>
        </Section>

        {/* 3 — Longitud */}
        <Section step="3" title="Longitud">
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(LENGTHS).map(([k, v]) => (
              <motion.button
                key={k}
                whileTap={{ scale: 0.93 }}
                onClick={() => setLength(k)}
                className={`py-3.5 rounded-xl text-sm font-bold border transition-all ${
                  length === k
                    ? "bg-[#d4af37] text-black border-[#d4af37] shadow-lg shadow-[#d4af37]/20"
                    : "bg-white/3 text-gray-400 border-white/8 hover:border-[#d4af37]/30"
                }`}
              >
                {v.label}
              </motion.button>
            ))}
          </div>
        </Section>

        {/* 4 — Extras */}
        <Section step="4" title="Diseños Extras (opcional)">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(EXTRAS).map(([k, v]) => {
              const on = extras.includes(k)
              return (
                <motion.button
                  key={k}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleExtra(k)}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                    on
                      ? "bg-violet-500/10 border-violet-400/40 text-violet-300"
                      : "bg-white/3 border-white/8 text-gray-400 hover:border-white/18"
                  }`}
                >
                  <span className="font-semibold text-sm">{v.label}</span>
                  <span className={`text-xs font-bold ${on ? "text-violet-400" : "text-gray-600"}`}>
                    {on ? "✓" : `+$${v.price}`}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </Section>

        {/* 5 — Nombre */}
        <Section step="5" title="Nombre del cliente (opcional)">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: María García"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/50 transition-colors"
          />
        </Section>

        {/* WhatsApp button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleWhatsApp}
          className="w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-500/15 bg-[#25d366] hover:bg-[#1da851] text-white"
        >
          <span className="text-2xl">💬</span>
          {sent ? "¡Cotización enviada! ✓" : "Enviar cotización por WhatsApp"}
        </motion.button>

        <p className="text-center text-gray-700 text-xs pb-4">
          Abrirá WhatsApp con el mensaje listo para enviar
        </p>
      </div>
    </DashboardLayout>
  )
}

/* ── sub-components ─────────────────────────────────────── */

function Section({ step, title, children }) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-5 h-5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-black flex items-center justify-center">
          {step}
        </span>
        <h3 className="text-white font-bold text-sm uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function OptionBtn({ active, onClick, label, sub }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-4 rounded-xl border text-left transition-all ${
        active
          ? "bg-[#d4af37]/10 border-[#d4af37]/45 shadow-sm shadow-[#d4af37]/10"
          : "bg-white/3 border-white/8 hover:border-white/18"
      }`}
    >
      <p className={`font-semibold text-sm ${active ? "text-[#d4af37]" : "text-gray-300"}`}>{label}</p>
      <p className="text-xs text-gray-600 mt-0.5">{sub}</p>
      {active && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2"
        />
      )}
    </motion.button>
  )
}

function Chip({ label, color }) {
  const cls = {
    gold:   "bg-[#d4af37]/12 border-[#d4af37]/25 text-[#d4af37]",
    gray:   "bg-white/5 border-white/10 text-gray-400",
    purple: "bg-violet-500/10 border-violet-400/25 text-violet-300",
  }
  return (
    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${cls[color] ?? cls.gray}`}>
      {label}
    </span>
  )
}
