"use client"
import { motion } from "framer-motion"
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data"

const HORARIOS = [
  { dia: "Lunes a Viernes", hora: "10:00 am - 8:00 pm" },
  { dia: "Sabado", hora: "9:00 am - 9:00 pm" },
  { dia: "Domingo", hora: "10:00 am - 7:00 pm" },
]

export default function Location() {
  return (
    <div className="px-4 pt-8 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-gray-800">Donde encontrarnos</h2>
        <p className="text-gray-400 text-sm mt-1">Estamos en Acambaro, Guanajuato</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-rose-100"
      >
        <div className="bg-gradient-to-br from-rose-500 to-pink-400 h-40 flex flex-col items-center justify-center text-white">
          <span className="text-5xl">📍</span>
          <p className="mt-2 font-black text-lg">Acambaro, Guanajuato</p>
          <p className="text-white/70 text-sm">Mexico</p>
        </div>
        <div className="p-4 flex gap-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            className="flex-1 bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm text-center"
          >
            Pedir por WhatsApp
          </a>
          <a
            href="https://maps.google.com/?q=Acambaro,Guanajuato,Mexico"
            target="_blank"
            className="flex-1 bg-rose-100 text-rose-600 font-bold py-2.5 rounded-xl text-sm text-center"
          >
            Ver en Maps
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-3 bg-white rounded-2xl p-4 shadow-sm border border-rose-100"
      >
        <h3 className="font-black text-gray-700 mb-3">Horario</h3>
        <div className="flex flex-col gap-2">
          {HORARIOS.map((h, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-500">{h.dia}</span>
              <span className="font-semibold text-gray-800">{h.hora}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
