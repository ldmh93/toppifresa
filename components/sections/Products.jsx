"use client"
import { motion } from "framer-motion"
import { PRODUCTOS } from "@/lib/data"
import ProductCard from "@/components/app/ProductCard"

export default function Products() {
  return (
    <div className="px-4 pt-8 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-gray-800">Nuestros Toppis</h2>
        <p className="text-gray-400 text-sm mt-1">10 sabores. Elige el tuyo.</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {PRODUCTOS.map((producto, i) => (
          <motion.div
            key={producto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <ProductCard producto={producto} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
