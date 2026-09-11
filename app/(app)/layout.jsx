import BottomTabs from '@/components/layout/BottomTabs'
import TopNav from '@/components/layout/TopNav'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp'
import DevCredit from '@/components/layout/DevCredit'
import { CartProvider } from '@/lib/cart/CartContext'
import CartBar from '@/components/cart/CartBar'
import CartDrawer from '@/components/cart/CartDrawerLazy'

export default function AppLayout({ children }) {
  return (
    <CartProvider>
      {/* Escritorio: barra superior. Móvil y tablet: tabs abajo. */}
      <TopNav />

      <main id="contenido" className="page-content">
        {children}
        <DevCredit />
      </main>

      <BottomTabs />
      <FloatingWhatsApp />
      <CartBar />
      <CartDrawer />
    </CartProvider>
  )
}
