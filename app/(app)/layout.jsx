import BottomTabs from '@/components/layout/BottomTabs'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp'

export default function AppLayout({ children }) {
  return (
    <>
      <main className="page-content">
        {children}
      </main>
      <BottomTabs />
      <FloatingWhatsApp />
    </>
  )
}
