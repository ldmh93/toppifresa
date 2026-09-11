'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageCircle, ShoppingBag } from 'lucide-react'
import clsx from 'clsx'
import { useCart } from '@/lib/cart/CartContext'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '524439425620'

// En escritorio hay sitio para el menú completo, así que aquí sí aparece
// Toppings (en móvil no cabe en la barra inferior).
const LINKS = [
  { href: '/', label: 'Inicio', exact: true },
  { href: '/productos', label: 'Menú' },
  { href: '/promos', label: 'Promos' },
  { href: '/toppings', label: 'Toppings' },
  { href: '/dinamicas', label: 'Dinámicas' },
  { href: '/ubicacion', label: 'Ubicación' },
]

/**
 * Barra de navegación de escritorio.
 *
 * Solo se muestra a partir de lg. En móvil y tablet manda BottomTabs, que es
 * el patrón que la gente espera en el teléfono.
 */
export default function TopNav() {
  const pathname = usePathname()
  const cart = useCart()

  const activo = (l) => (l.exact ? pathname === l.href : pathname.startsWith(l.href))

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hola! 👋 Quiero hacer un pedido en Toppifresa 🍓',
  )}`

  const itemCount = cart?.hydrated ? cart.itemCount : 0

  return (
    <header className="sticky top-0 z-40 hidden border-b border-app-border glass lg:block">
      <nav className="mx-auto flex max-w-[1280px] items-center gap-8 px-8 py-3">
        <Link href="/" aria-label="Toppifresa — inicio" className="flex-shrink-0">
          {/* SVG: next/image no lo optimizaría (solo lo reenvía), y además
              obligaría a habilitar dangerouslyAllowSVG. <img> es lo correcto. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-wordmark.svg"
            alt="Toppifresa"
            width={357}
            height={78}
            className="h-8 w-auto"
          />
        </Link>

        <ul className="flex flex-1 items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={activo(l) ? 'page' : undefined}
                className={clsx(
                  'relative block rounded-xl px-3.5 py-2 text-sm font-bold transition-colors',
                  activo(l)
                    ? 'text-primary'
                    : 'text-app-muted hover:bg-primary-50 hover:text-primary',
                )}
              >
                {l.label}
                {activo(l) && (
                  <motion.span
                    layoutId="topnav-activo"
                    className="absolute inset-x-3.5 -bottom-[13px] h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-shrink-0 items-center gap-3">
          {cart && (
            <button
              onClick={() => cart.setDrawerOpen(true)}
              className="relative flex items-center gap-2 rounded-xl border-2 border-app-border px-3.5 py-2 text-sm font-bold text-app-text transition-colors hover:border-primary hover:text-primary"
              aria-label={
                itemCount > 0
                  ? `Abrir carrito, ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}, total ${cart.total} pesos`
                  : 'Abrir carrito, está vacío'
              }
            >
              <ShoppingBag size={18} />
              {itemCount > 0 ? <span>${cart.total}</span> : <span>Carrito</span>}
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-white">
                  {itemCount}
                </span>
              )}
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle size={16} strokeWidth={2.5} />
            Pedir por WhatsApp
          </a>
        </div>
      </nav>
    </header>
  )
}
