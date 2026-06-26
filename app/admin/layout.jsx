'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShoppingBag, Sparkles,
  Tag, Users, Settings, ChevronLeft,
} from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/productos', label: 'Productos', icon: ShoppingBag },
  { href: '/admin/toppings', label: 'Toppings', icon: Sparkles },
  { href: '/admin/promos', label: 'Promos', icon: Tag },
  { href: '/admin/dinamicas', label: 'Clientes', icon: Users },
  { href: '/admin/config', label: 'Config', icon: Settings },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()

  const isActive = (nav) =>
    nav.exact ? pathname === nav.href : pathname.startsWith(nav.href)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center tap-scale">
            <ChevronLeft size={18} className="text-primary" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg">🍓</span>
            <span className="font-black text-app-text text-base">Admin</span>
            <span className="text-app-muted text-xs font-medium">Toppifresa</span>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="max-w-2xl mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar border-t border-gray-100">
            {NAV.map((nav) => {
              const Icon = nav.icon
              const active = isActive(nav)
              return (
                <Link
                  key={nav.href}
                  href={nav.href}
                  className={clsx(
                    'flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2.5 text-[11px] font-semibold border-b-2 transition-colors',
                    active
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-600',
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                  {nav.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-2xl mx-auto px-4 py-5">
        {children}
      </div>
    </div>
  )
}
