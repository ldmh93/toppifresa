import PromoCarousel from '@/components/promos/PromoCarousel'
import { Tag } from 'lucide-react'

export const metadata = {
  title: 'Promos',
  description: 'Ofertas y promociones especiales de Toppifresa.',
}

function PromoRules() {
  const rules = [
    { emoji: '📱', text: 'Muestra esta pantalla al momento de tu pedido' },
    { emoji: '🕐', text: 'Válidas mientras dure existencia' },
    { emoji: '📍', text: 'Solo en punto de venta en Acámbaro' },
    { emoji: '🔗', text: 'No acumulable con otras promociones' },
  ]

  return (
    <div className="px-5 mt-6">
      <h2 className="text-base font-bold text-app-text mb-3">Términos y condiciones</h2>
      <div className="card-base p-4 flex flex-col gap-3">
        {rules.map((r, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">{r.emoji}</span>
            <p className="text-sm text-app-muted leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PromosPage() {
  return (
    <div className="pb-4">
      {/* Header */}
      <div
        className="px-5 pt-14 pb-6"
        style={{ background: 'linear-gradient(160deg, #F5B731 0%, #E85D04 100%)' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <Tag size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-2xl leading-tight">Promos</h1>
            <p className="text-white/70 text-sm">Ofertas por tiempo limitado 🔥</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <PromoCarousel />
      </div>

      <PromoRules />
    </div>
  )
}
