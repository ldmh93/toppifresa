'use client'

import { motion } from 'framer-motion'
import { Bell, Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { estaAbierto, HORARIO_SEMANAL } from '@/lib/data/horarios'

function formato12h(h24) {
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:00 ${ampm}`
}

/**
 * Aviso de abierto/cerrado.
 *
 * Se calcula después de montar, nunca en el servidor: el HTML se genera una
 * sola vez en el build y quedaría congelado con el estado de ese momento
 * (además de provocar un desajuste de hidratación).
 */
function EstadoNegocio() {
  const [estado, setEstado] = useState(null)

  useEffect(() => {
    const calcular = () => {
      const ahora = new Date()
      const hoy = HORARIO_SEMANAL[ahora.getDay()]
      setEstado({ abierto: estaAbierto(ahora), cierra: hoy ? formato12h(hoy.cierra) : null })
    }
    calcular()
    // Se refresca cada minuto para que no se quede en "abierto" tras el cierre.
    const id = setInterval(calcular, 60_000)
    return () => clearInterval(id)
  }, [])

  // Reserva la altura desde el primer pintado para que no salte el layout.
  if (!estado) return <div className="h-7" aria-hidden="true" />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-7 items-center justify-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
        <span
          className={`h-2 w-2 rounded-full ${
            estado.abierto ? 'animate-pulse bg-leaf-300' : 'bg-white/50'
          }`}
        />
        {estado.abierto ? (
          <>Abierto ahora{estado.cierra && ` · cierra ${estado.cierra}`}</>
        ) : (
          <>Cerrado · sábado y domingo 5–10 PM</>
        )}
      </span>
    </motion.div>
  )
}

export default function HeroApp() {
  return (
    <div className="relative overflow-hidden">
      {/* Fondo: degradado de marca + patrón de fresas del branding */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
      <div
        className="absolute inset-0 opacity-[0.13] mix-blend-overlay"
        style={{
          backgroundImage: "url('/brand/pattern-strawberries.svg')",
          backgroundSize: '260px auto',
        }}
        aria-hidden="true"
      />

      {/* Halos decorativos */}
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/5" aria-hidden="true" />
      <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/5" aria-hidden="true" />

      <div className="relative z-10 px-5 pb-8 pt-12 sm:px-8 lg:px-12 lg:pb-14 lg:pt-16">
        {/* Barra superior */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-white/80">📍 Acámbaro, Gto.</p>
          <Link href="/promos" aria-label="Ver promociones">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
            >
              <Bell size={20} className="text-white" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-primary-800 bg-gold" />
            </motion.div>
          </Link>
        </div>

        {/* En escritorio el logo y el buscador se reparten en dos columnas */}
        <div className="lg:flex lg:items-center lg:gap-12">
          <div className="lg:flex-1">
            {/* El logotipo oficial ya incluye el nombre y el eslogan, así que
                hace de encabezado principal. El alt aporta el texto accesible. */}
            <h1>
              <motion.img
                src="/brand/logo-full.svg"
                alt="Toppifresa — Tu dosis de felicidad diaria"
                width={445}
                height={222}
                fetchPriority="high"
                className="mx-auto w-full max-w-[280px] select-none drop-shadow-xl sm:max-w-[340px] lg:mx-0 lg:max-w-[420px]"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.28))' }}
              />
            </h1>
          </div>

          <div className="mt-6 lg:mt-0 lg:flex-1">
            <div className="lg:rounded-3xl lg:bg-white/10 lg:p-6 lg:backdrop-blur-sm">
              <EstadoNegocio />

              <p className="mt-3 text-center text-sm text-white/75 lg:text-left lg:text-base">
                Sabores únicos · Toppings premium · Pide por WhatsApp
              </p>

              {/* Acceso al catálogo con aspecto de buscador */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="mt-5"
              >
                <Link href="/productos" aria-label="Ver todo el menú de Toppifresa">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3.5 backdrop-blur-sm transition-colors hover:bg-white/25">
                    <Search size={18} className="text-white/70" />
                    <span className="text-sm text-white/70">Buscar tu Toppi favorito…</span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
