"use client"
import { motion } from "framer-motion"
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data"

export default function FloatingWhatsApp() {
  const open = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, "_blank")
  }

  return (
    <motion.button
      onClick={open}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", delay: 0.5 }}
      className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center"
      style={{ boxShadow: "0 4px 24px rgba(34,197,94,0.45)" }}
    >
      <motion.span
        className="text-2xl"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        💬
      </motion.span>
    </motion.button>
  )
}
