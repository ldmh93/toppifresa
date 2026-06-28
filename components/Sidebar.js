"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const NAV = [
  { href: "/",           icon: "◆",  label: "Dashboard"  },
  { href: "/calculator", icon: "💅", label: "Cotizador"  },
  { href: "/agenda",     icon: "📅", label: "Agenda"     },
  { href: "/clientes",   icon: "👩", label: "Clientes"   },
  { href: "/reportes",   icon: "📊", label: "Reportes"   },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 h-full bg-[#0d0d0d] border-r border-[#d4af37]/15 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#d4af37]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center text-black font-black text-lg select-none">
            N
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Nail Studio</h1>
            <p className="text-[#d4af37] text-xs opacity-80">Panel de Control</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: active ? 0 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative ${
                  active
                    ? "bg-[#d4af37]/12 text-[#d4af37] border border-[#d4af37]/25"
                    : "text-gray-400 hover:text-white hover:bg-white/4 border border-transparent"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="sidebar-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer badge */}
      <div className="p-4 border-t border-[#d4af37]/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/15">
          <span className="text-xl">💄</span>
          <div>
            <p className="text-white text-xs font-semibold">Mi Nail Studio</p>
            <p className="text-[#d4af37]/50 text-[10px]">Dashboard Pro</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
