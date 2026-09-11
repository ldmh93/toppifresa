import { getProductosPublicos } from '@/lib/data/products'
import MenuCard from './MenuCard'
import { UtensilsCrossed } from 'lucide-react'

export default function MenuSection() {
  const productos = getProductosPublicos()

  return (
    <section className="mt-6 px-5 sm:px-8 lg:px-12" aria-labelledby="titulo-menu">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
          <UtensilsCrossed size={20} className="text-primary" />
        </div>
        <div>
          <h2 id="titulo-menu" className="font-display text-xl font-black text-app-text">
            Menú Digital
          </h2>
          <p className="text-xs text-app-muted">Elige, personaliza y pide directo por WhatsApp</p>
        </div>
      </div>

      {/* En escritorio el menú se reparte en dos columnas */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-5">
        {productos.map((product, i) => (
          <MenuCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  )
}
