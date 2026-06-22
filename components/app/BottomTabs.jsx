"use client"
import { motion } from "framer-motion"
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data"

const TABS = [
  { id: "inicio", label: "Inicio", icon: "🏠" },
  { id: "productos", label: "Fresas", icon: "🍓" },
  { id: "promos", label: "Promos", icon: "🔥" },
  { id: "dinamicas", label: "Cupones", icon: "🎁" },
  { id: "ubicacion", label: "Lugar", icon: "📍" },
]

export default function BottomTabs({ activeTab, onChange }) {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, "_blank")
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-rose-100 shadow-lg">
      <div className="flex items-stretch justify-around px-1 max-w-lg mx-auto">
        {TABS.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.85 }}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center gap-0.5 py-2 px-2 flex-1 relative"
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="tabActive"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-pink-500 rounded-full"
              />
            )}
            <span className="text-xl">{tab.icon}</span>
            <span className={`text-[10px] font-semibold ${activeTab === tab.id ? "text-pink-600" : "text-gray-400"}`}>
              {tab.label}
            </span>
          </motion.button>
        ))}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleWhatsApp}
          className="flex flex-col items-center gap-0.5 py-2 px-2 flex-1"
        >
          <span className="text-xl">💬</span>
          <span className="text-[10px] font-semibold text-green-500">WhatsApp</span>
        </motion.button>
      </div>
    </nav>
  )
}
