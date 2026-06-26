import { products } from '@/lib/data/products'
import MenuCard from './MenuCard'
import { UtensilsCrossed } from 'lucide-react'

export default function MenuSection() {
  return (
    <section className="mt-6 px-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center">
          <UtensilsCrossed size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-black text-app-text">Menú Digital</h2>
          <p className="text-xs text-app-muted">Elige, personaliza y pide directo por WhatsApp</p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {products.map((product, i) => (
          <MenuCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  )
}
