'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, ShoppingBag, Tag, Sparkles, MapPin, MessageCircle } from 'lucide-react'
import clsx from 'clsx'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '524439425620'

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

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hola! 👋 Quiero hacer un pedido en Toppifresa 🍓',
  )}`

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="glass border-t border-app-border shadow-bottom-nav">
        <div className="flex items-stretch">
          {tabs.map((tab) => (
            <TabItem key={tab.href} tab={tab} isActive={isActive(tab)} />
          ))}

          {/* WhatsApp tab */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center flex-1 py-2 gap-0.5 tap-scale"
          >
            <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-fab">
              <MessageCircle size={18} className="text-white" strokeWidth={2.5} fill="white" />
            </div>
            <span className="text-[10px] font-medium text-gray-400">Pedir</span>
          </a>
        </div>
      </div>
    </nav>
  )
}
