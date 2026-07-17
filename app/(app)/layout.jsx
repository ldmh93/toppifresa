import BottomTabs from '@/components/layout/BottomTabs'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp'
import DevCredit from '@/components/layout/DevCredit'
import { CartProvider } from '@/lib/cart/CartContext'
import CartBar from '@/components/cart/CartBar'
import CartDrawer from '@/components/cart/CartDrawerLazy'

export default function AppLayout({ children }) {
  return (
    <CartProvider>
      <main className="page-content">
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
