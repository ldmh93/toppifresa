"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

const BENEFICIOS = [
  "Participa en sorteos mensuales",
  "Recibe cupones de descuento exclusivos",
  "Accede a promos antes que nadie",
]

export default function Coupons() {
  const [form, setForm] = useState({ nombre: "", telefono: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError("Por favor llena todos los campos")
      return
    }
    setLoading(true)
    setError("")
    try {
      await addDoc(collection(db, "dinamicas"), {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        fecha: serverTimestamp(),
      })
      setSuccess(true)
      setForm({ nombre: "", telefono: "" })
    } catch {
      setError("Algo salio mal. Intentalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pt-8 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-gray-800">Dinamicas y Cupones</h2>
        <p className="text-gray-400 text-sm mt-1">Registrate gratis y gana descuentos</p>
      </motion.div>

      <div className="flex flex-col gap-2 mt-4">
        {BENEFICIOS.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 shadow-sm border border-rose-100"
          >
            <span className="text-pink-500 font-black">✓</span>
            <span className="text-sm text-gray-700 font-medium">{b}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-5 bg-green-50 border border-green-200 rounded-2xl p-6 text-center"
          >
            <span className="text-4xl">🎉</span>
            <h3 className="text-lg font-black text-green-700 mt-2">Ya estas participando</h3>
            <p className="text-green-600 text-sm mt-1">Te avisaremos cuando haya una dinamica disponible</p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 text-green-600 text-sm font-semibold underline"
            >
              Registrar otro participante
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-rose-100"
          >
            <h3 className="font-black text-gray-800 mb-4">Registrate gratis</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Tu nombre completo"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400"
              />
              <input
                type="tel"
                placeholder="Tu numero de WhatsApp"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400"
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-3.5 rounded-xl text-sm disabled:opacity-60"
            >
              {loading ? "Registrando..." : "🎁 Participar en dinamicas"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
