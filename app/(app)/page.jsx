import HeroApp from '@/components/home/HeroApp'
import MenuSection from '@/components/home/MenuSection'
import PromoCarousel from '@/components/promos/PromoCarousel'
import { toppingCategories } from '@/lib/data/toppings'
import Link from 'next/link'
import { ArrowRight, Sparkles, Tag } from 'lucide-react'

export const metadata = {
  title: 'Inicio | Toppifresa',
  description: 'Las mejores fresas con crema en Acámbaro, Guanajuato. Pide por WhatsApp.',
}

function ToppingsSneak() {
  const allToppings = toppingCategories.flatMap((c) => c.items).slice(0, 10)
  return (
    <section className="mt-8 px-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-app-text">Toppings ✨</h2>
          <p className="text-xs text-app-muted">Lo que ponemos en tus fresas</p>
        </div>
        <Link href="/toppings" className="flex items-center gap-1 text-primary text-sm font-semibold">
          Ver todos <ArrowRight size={16} />
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {allToppings.map((t) => (
          <span
            key={t.id}
            className="inline-flex items-center gap-1 bg-white border border-app-border px-3 py-1.5 rounded-full text-xs font-medium text-app-text shadow-sm"
          >
            {t.emoji} {t.name}
          </span>
        ))}
        <Link
          href="/toppings"
          className="inline-flex items-center gap-1 bg-primary-50 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold"
        >
          +más <ArrowRight size={11} />
        </Link>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="pb-4">
      <HeroApp />
      <MenuSection />
      <ToppingsSneak />

      <div className="mt-8">
        <div className="px-5 flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-app-text flex items-center gap-2">
              <Tag size={18} className="text-primary" /> Promos
            </h2>
            <p className="text-xs text-app-muted">Ofertas por tiempo limitado</p>
          </div>
          <Link href="/promos" className="flex items-center gap-1 text-primary text-sm font-semibold">
            Ver más <ArrowRight size={16} />
          </Link>
        </div>
        <PromoCarousel />
      </div>

      <div className="px-5 mt-6 mb-4">
        <Link href="/dinamicas">
          <div
            className="rounded-3xl p-5 relative overflow-hidden tap-scale"
            style={{ background: 'linear-gradient(135deg, #A855F7, #7C3AED)' }}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="flex items-start justify-between">
              <div className="flex-1 z-10 relative">
                <span className="text-white/80 text-xs font-bold tracking-widest uppercase">Dinámica activa</span>
                <h3 className="text-white font-black text-xl mt-1 leading-tight">
                  Gana un Toppi<br />gratis 🎁
                </h3>
                <p className="text-white/70 text-sm mt-1 mb-4">Regístrate y participa para ganar</p>
                <div className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold text-sm px-4 py-2 rounded-xl">
                  <Sparkles size={16} /> Participar
                </div>
              </div>
              <span className="text-6xl flex-shrink-0">🎉</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
