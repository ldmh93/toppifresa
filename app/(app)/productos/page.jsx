import ProductGrid from '@/components/products/ProductGrid'
import { ShoppingBag } from 'lucide-react'

export const metadata = {
  title: 'Productos',
  description: 'Los 10 sabores de Toppifresa. Fresas con crema y toppings premium.',
}

export default function ProductosPage() {
  return (
    <div>
      {/* Header */}
      <div
        className="px-5 pt-14 pb-6"
        style={{ background: 'linear-gradient(160deg, #D63864 0%, #9B1C40 100%)' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-2xl leading-tight">Nuestros Toppis</h1>
            <p className="text-white/70 text-sm">10 sabores únicos</p>
          </div>
        </div>
      </div>

      {/* Grid with filters */}
      <ProductGrid />
    </div>
  )
}
