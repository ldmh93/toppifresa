"use client"
import { motion } from "framer-motion"
import { PROMOCIONES, WHATSAPP_NUMBER } from "@/lib/data"

export default function Promotions() {
  const pedir = (promo) => {
    const msg = encodeURIComponent(`Hola, quiero la promo: ${promo.titulo} 🍓`)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank")
  }

  return (
    <div className="px-4 pt-8 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-gray-800">Promos del Dia</h2>
        <p className="text-gray-400 text-sm mt-1">Aprovecha antes de que se acaben</p>
      </motion.div>
      <div className="flex flex-col gap-4 mt-4">
        {PROMOCIONES.map((promo, i) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-5 text-white relative overflow-hidden shadow-md ${promo.bg}`}
          >
            <span className="absolute top-3 right-3 bg-white/20 text-xs font-black px-2 py-0.5 rounded-full">
              {promo.badge}
            </span>
            <span className="text-4xl">{promo.emoji}</span>
            <h3 className="text-xl font-black mt-2">{promo.titulo}</h3>
            <p className="text-white/80 text-sm mt-1">{promo.descripcion}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-black">{promo.precio}</span>
              <button
                onClick={() => pedir(promo)}
                className="bg-white text-gray-800 font-bold py-2 px-4 rounded-xl text-sm"
              >
                Pedir ahora
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
