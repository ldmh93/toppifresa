"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "./Sidebar"

const NAV = [
  { href: "/",           icon: "◆",  label: "Dashboard" },
  { href: "/calculator", icon: "💅", label: "Cotizador" },
  { href: "/agenda",     icon: "📅", label: "Agenda"    },
  { href: "/clientes",   icon: "👩", label: "Clientes"  },
  { href: "/reportes",   icon: "📊", label: "Reportes"  },
]

export default function DashboardLayout({ children, title }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const dateStr = new Date().toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long",
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full z-50 md:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-2 -ml-1 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Abrir menú"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6"  x2="17" y2="6"  strokeLinecap="round"/>
                <line x1="3" y1="10" x2="17" y2="10" strokeLinecap="round"/>
                <line x1="3" y1="14" x2="17" y2="14" strokeLinecap="round"/>
              </svg>
            </button>
            <h2 className="text-white font-bold text-lg">{title}</h2>
          </div>
          <span className="text-[#d4af37]/70 text-xs hidden sm:block capitalize">{dateStr}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-8 overflow-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0d0d0d]/98 backdrop-blur-md border-t border-[#d4af37]/12 z-30 safe-area-bottom">
          <div className="flex items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
            {NAV.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <span className={`text-xl leading-none ${active ? "" : "opacity-40"}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[9px] font-bold tracking-wide ${active ? "text-[#d4af37]" : "text-gray-600"}`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
