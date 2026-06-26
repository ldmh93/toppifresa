import CouponForm from '@/components/coupons/CouponForm'
import { Sparkles, Trophy, Gift, Users } from 'lucide-react'

export const metadata = {
  title: 'Dinámicas',
  description: 'Participa en las dinámicas de Toppifresa y gana premios.',
}

const steps = [
  { icon: '✍️', title: 'Regístrate', desc: 'Ingresa tu nombre y WhatsApp' },
  { icon: '⏳', title: 'Espera', desc: 'Seleccionamos un ganador al azar' },
  { icon: '🏆', title: 'Gana', desc: 'Te avisamos por WhatsApp si ganaste' },
  { icon: '🍓', title: 'Disfruta', desc: 'Ven a reclamar tu Toppi gratis' },
]

export default function DinamicasPage() {
  return (
    <div className="pb-4">
      {/* Hero */}
      <div
        className="px-5 pt-14 pb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #A855F7 0%, #4F0D6E 100%)' }}
      >
        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute bottom-0 -left-8 w-28 h-28 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-2xl leading-tight">Dinámicas</h1>
              <p className="text-white/70 text-sm">Participa y gana</p>
            </div>
          </div>

          {/* Prize card */}
          <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-5 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Gift size={24} className="text-amber-300" />
              <span className="text-white font-bold text-lg">Premio del mes</span>
            </div>
            <p className="text-white font-black text-2xl mb-1">1 Toppi Grande</p>
            <p className="text-white/70 text-sm">de tu elección + toppings premium</p>
            <div className="flex items-center gap-2 mt-3">
              <Users size={14} className="text-white/60" />
              <span className="text-white/60 text-xs">Ganador seleccionado al azar</span>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-5 mt-6">
        <h2 className="font-bold text-app-text text-base mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-primary" />
          ¿Cómo participar?
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {steps.map((step, i) => (
            <div key={i} className="card-base p-4">
              <span className="text-2xl">{step.icon}</span>
              <p className="font-bold text-app-text text-sm mt-2">{step.title}</p>
              <p className="text-app-muted text-xs mt-0.5 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="px-5">
        <div className="card-base p-5">
          <h2 className="font-black text-app-text text-lg mb-1">Quiero participar</h2>
          <p className="text-app-muted text-sm mb-5">
            Completa el formulario para entrar al sorteo 🎉
          </p>
          <CouponForm />
        </div>
      </div>
    </div>
  )
}
