"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardLayout from "@/components/DashboardLayout"
import { getClientes, saveClientes } from "@/lib/storage"

const BLANK = { nombre: "", telefono: "", notas: "", historial: [], ultimaVisita: "" }

export default function ClientesPage() {
  const [clientes,   setClientes]   = useState([])
  const [search,     setSearch]     = useState("")
  const [showForm,   setShowForm]   = useState(false)
  const [form,       setForm]       = useState(BLANK)
  const [selected,   setSelected]   = useState(null)
  const [newService, setNewService] = useState("")

  useEffect(() => { setClientes(getClientes()) }, [])

  const save = (list) => { setClientes(list); saveClientes(list) }

  const addCliente = () => {
    if (!form.nombre.trim()) return
    save([...clientes, { ...form, id: Date.now().toString() }])
    setForm(BLANK)
    setShowForm(false)
  }

  const del = (id) => {
    save(clientes.filter((c) => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const addHistorial = (clienteId) => {
    if (!newService.trim()) return
    const today   = new Date().toISOString().split("T")[0]
    const updated = clientes.map((c) =>
      c.id === clienteId
        ? { ...c, historial: [newService.trim(), ...(c.historial ?? [])], ultimaVisita: today }
        : c
    )
    save(updated)
    setSelected(updated.find((c) => c.id === clienteId) ?? null)
    setNewService("")
  }

  const filtered = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.telefono.includes(search)
  )

  const waLink = (tel) =>
    `https://wa.me/52${tel.replace(/\D/g, "")}`

  const initials = (name) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("")

  return (
    <DashboardLayout title="Clientas">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ── Left: List ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Search + add */}
            <div className="flex gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar clienta…"
                className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/50 transition-colors"
              />
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setShowForm((v) => !v)}
                className="w-12 h-12 bg-[#d4af37] hover:bg-[#b8962e] text-black font-black text-xl rounded-xl transition-colors flex items-center justify-center"
              >
                {showForm ? "✕" : "+"}
              </motion.button>
            </div>

            {/* Inline form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{   opacity: 0, height: 0     }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="bg-[#111] border border-[#d4af37]/30 rounded-2xl p-5 space-y-3">
                    <p className="text-white font-bold text-sm">Nueva Clienta</p>
                    <input
                      value={form.nombre}
                      onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                      placeholder="Nombre completo *"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/50"
                    />
                    <input
                      value={form.telefono}
                      onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))}
                      placeholder="Teléfono (10 dígitos)"
                      type="tel"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/50"
                    />
                    <textarea
                      value={form.notas}
                      onChange={(e) => setForm((p) => ({ ...p, notas: e.target.value }))}
                      placeholder="Notas (alergias, preferencias…)"
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/50 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addCliente}
                        disabled={!form.nombre.trim()}
                        className="flex-1 py-2.5 bg-[#d4af37] hover:bg-[#b8962e] disabled:opacity-40 text-black font-bold rounded-xl text-sm transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2.5 bg-white/5 text-gray-400 rounded-xl text-sm hover:bg-white/8"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Client cards */}
            <div className="space-y-2">
              {filtered.map((c, i) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: i * 0.04 } }}
                  onClick={() => setSelected(c)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.id === c.id
                      ? "bg-[#d4af37]/8 border-[#d4af37]/35"
                      : "bg-[#111] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-black text-xs shrink-0">
                      {initials(c.nombre)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{c.nombre}</p>
                      <p className="text-gray-500 text-xs truncate">{c.telefono || "Sin teléfono"}</p>
                    </div>
                    <span className="text-gray-600 text-xs shrink-0">{(c.historial ?? []).length} visitas</span>
                  </div>
                </motion.button>
              ))}

              {filtered.length === 0 && (
                <div className="py-12 text-center text-gray-600">
                  <p className="text-4xl mb-2">👩‍💼</p>
                  <p className="text-sm">{search ? "Sin resultados" : "No hay clientas aún"}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Detail ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0  }}
                  exit={{   opacity: 0         }}
                  className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-r from-[#d4af37]/5 to-transparent border-b border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/25 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] font-black text-2xl shrink-0">
                        {initials(selected.nombre)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-white font-bold text-xl leading-tight">{selected.nombre}</h2>
                        <p className="text-gray-400 text-sm">{selected.telefono || "Sin teléfono"}</p>
                        {selected.ultimaVisita && (
                          <p className="text-gray-600 text-xs mt-1">
                            Última visita:{" "}
                            {new Date(selected.ultimaVisita + "T12:00:00").toLocaleDateString("es-MX", {
                              day: "numeric", month: "long", year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {selected.telefono && (
                          <a
                            href={waLink(selected.telefono)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 hover:bg-green-500/18 transition-colors"
                            title="Enviar WhatsApp"
                          >
                            💬
                          </a>
                        )}
                        <button
                          onClick={() => del(selected.id)}
                          className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/18 transition-colors"
                          title="Eliminar clienta"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selected.notas && (
                    <div className="px-6 py-4 border-b border-white/5">
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Notas</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{selected.notas}</p>
                    </div>
                  )}

                  {/* Add service */}
                  <div className="px-6 py-4 border-b border-white/5">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Registrar servicio</p>
                    <div className="flex gap-2">
                      <input
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addHistorial(selected.id)}
                        placeholder="Ej: Full Set – Coffin – Chrome"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4af37]/50 transition-colors"
                      />
                      <button
                        onClick={() => addHistorial(selected.id)}
                        className="px-4 py-2.5 bg-[#d4af37] hover:bg-[#b8962e] text-black font-bold rounded-xl text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* History */}
                  <div className="px-6 py-4">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                      Historial ({(selected.historial ?? []).length} servicios)
                    </p>
                    {(selected.historial ?? []).length > 0 ? (
                      <div className="space-y-2.5">
                        {selected.historial.map((s, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0 mt-1.5" />
                            <span className="text-gray-300 text-sm">{s}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm">Sin historial aún. Registra el primer servicio ↑</p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-72 flex flex-col items-center justify-center text-gray-700 rounded-2xl border border-white/3 bg-[#111]"
                >
                  <p className="text-5xl mb-3">👩‍💼</p>
                  <p className="text-sm">Selecciona una clienta para ver su perfil</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
