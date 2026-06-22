"use client"
import { motion } from "framer-motion"
import StorySlider from "@/components/app/StorySlider"
import ProductCard from "@/components/app/ProductCard"
import { INSTAGRAM_URL, FACEBOOK_URL, WHATSAPP_NUMBER, WHATSAPP_MESSAGE, PRODUCTOS } from "@/lib/data"

export default function Home({ onTabChange }) {
  const pedirAhora = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, "_blank")
  }

  return (
    <div className="pb-4">
      <div className="bg-gradient-to-b from-rose-600 via-pink-500 to-rose-50 px-4 pt-12 pb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="text-5xl">🍓</span>
          <h1 className="text-4xl font-black text-white mt-2 tracking-tight">Toppifresa</h1>
          <p className="text-white/80 text-sm mt-1">Fresas con crema · Acambaro, Gto.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 flex flex-col gap-2"
        >
          <button
            onClick={pedirAhora}
            className="w-full bg-green-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ boxShadow: "0 4px 20px rgba(34,197,94,0.35)" }}
          >
            💬 Pedir por WhatsApp
          </button>
          <div className="flex gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              className="flex-1 bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 rounded-xl text-sm text-center"
            >
              📸 Instagram
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              className="flex-1 bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 rounded-xl text-sm text-center"
            >
              👥 Facebook
            </a>
          </div>
        </motion.div>
      </div>

      <div className="-mt-4">
        <StorySlider />
      </div>

      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-gray-800">Los mas pedidos</h2>
          <button onClick={() => onTabChange("productos")} className="text-pink-500 text-sm font-semibold">
            Ver todos
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTOS.filter((p) => p.popular).map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mx-4 mt-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎁</span>
          <div>
            <p className="font-black">Gana cupones de descuento</p>
            <p className="text-white/80 text-sm">Registrate y participa en nuestras dinamicas</p>
          </div>
        </div>
        <button
          onClick={() => onTabChange("dinamicas")}
          className="mt-3 w-full bg-white text-purple-600 font-bold py-2.5 rounded-xl text-sm"
        >
          Participar ahora
        </button>
      </motion.div>
    </div>
  )
}
