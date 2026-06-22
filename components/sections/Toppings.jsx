"use client"
import { motion } from "framer-motion"
import { TOPPINGS } from "@/lib/data"

const COLORES = [
  "bg-pink-100 text-pink-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-blue-100 text-blue-700",
  "bg-orange-100 text-orange-700",
]

export default function Toppings() {
  return (
    <div className="px-4 pt-8 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-gray-800">Toppings Disponibles</h2>
        <p className="text-gray-400 text-sm mt-1">Combinalos todos al hacer tu pedido</p>
      </motion.div>
      <div className="flex flex-wrap gap-2 mt-5">
        {TOPPINGS.map((topping, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold ${COLORES[i % COLORES.length]}`}
          >
            {topping.emoji} {topping.nombre}
          </motion.span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 bg-rose-50 border border-rose-200 rounded-2xl p-4"
      >
        <p className="text-rose-600 text-sm font-medium text-center">
          🍓 Menciona los toppings que quieras al pedir por WhatsApp
        </p>
      </motion.div>
    </div>
  )
}
