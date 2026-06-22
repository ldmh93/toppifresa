"use client"
import { motion } from "framer-motion"
import { WHATSAPP_NUMBER } from "@/lib/data"

export default function ProductCard({ producto }) {
  const pedir = () => {
    const msg = encodeURIComponent(`Hola, quiero pedir un ${producto.nombre} 🍓`)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank")
  }

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden"
    >
      <div className={`h-28 flex items-center justify-center relative ${producto.bg}`}>
        <span className="text-5xl">{producto.emoji}</span>
        {producto.popular && (
          <span className="absolute top-2 right-2 bg-white text-pink-600 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
            ⭐ Popular
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-gray-800 text-sm">{producto.nombre}</h3>
        <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{producto.descripcion}</p>
        <button
          onClick={pedir}
          className="mt-3 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold py-2 rounded-xl"
        >
          💬 Pedir
        </button>
      </div>
    </motion.div>
  )
}
