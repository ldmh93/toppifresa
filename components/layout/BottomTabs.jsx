'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, ShoppingBag, Tag, Sparkles, MapPin } from 'lucide-react'
import clsx from 'clsx'


const tabs = [
  { href: '/', icon: Home, label: 'Inicio', exact: true },
  { href: '/productos', icon: ShoppingBag, label: 'Productos' },
  { href: '/promos', icon: Tag, label: 'Promos' },
  { href: '/dinamicas', icon: Sparkles, label: 'Dinámicas' },
  { href: '/ubicacion', icon: MapPin, label: 'Ubicación' },
]

function TabItem({ tab, isActive }) {
  const Icon = tab.icon
  return (
    <Link
      href={tab.href}
      aria-current={isActive ? 'page' : undefined}
      className="flex flex-col items-center justify-center flex-1 py-2 gap-0.5 relative tap-scale"
    >
      {isActive && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
      <motion.div
        animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <Icon
          size={22}
          strokeWidth={isActive ? 2.5 : 1.8}
          className={clsx(
            'transition-colors duration-200',
            isActive ? 'text-primary' : 'text-gray-400',
          )}
        />
      </motion.div>
      <span
        className={clsx(
          'text-[10px] font-medium transition-colors duration-200',
          isActive ? 'text-primary font-semibold' : 'text-gray-400',
        )}
      >
        {tab.label}
      </span>
    </Link>
  )
}

export default function BottomTabs() {
  const pathname = usePathname()

  const isActive = (tab) => {
    if (tab.exact) return pathname === tab.href
    return pathname.startsWith(tab.href)
  }

  return (
    // Se oculta en escritorio: a partir de lg manda TopNav.
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[var(--content-max)] z-50 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="glass border-t border-app-border shadow-bottom-nav">
        <div className="flex items-stretch">
          {/* Antes había aquí una sexta pestaña "Pedir" que abría WhatsApp.
              Se quitó porque duplicaba el botón flotante verde (que además
              ofrece mensajes rápidos) y ambos quedaban uno encima del otro en
              la esquina inferior derecha. Al salir, las cinco pestañas
              restantes ganan ancho y se tocan mejor con el pulgar. */}
          {tabs.map((tab) => (
            <TabItem key={tab.href} tab={tab} isActive={isActive(tab)} />
          ))}
        </div>
      </div>
    </nav>
  )
}
