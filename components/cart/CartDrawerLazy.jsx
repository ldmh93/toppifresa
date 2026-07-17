'use client'

import dynamic from 'next/dynamic'

// El drawer es pesado (formulario + modal); se carga solo en el navegador
// y fuera del bundle inicial de la página.
const CartDrawer = dynamic(() => import('./CartDrawer'), { ssr: false })

export default function CartDrawerLazy() {
  return <CartDrawer />
}
