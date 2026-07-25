// page.jsx es un componente de cliente ('use client') y por eso no puede
// exportar `metadata`. Este layout mínimo existe solo para dar título y
// descripción propios a la ruta; no envuelve ni altera nada del render.
export const metadata = {
  title: 'Toppings',
  description:
    'Los 25 toppings de Toppifresa: crujientes, chispas, cereales, frutas, coberturas y picantes. Elige 2 por producto.',
}

export default function ToppingsLayout({ children }) {
  return children
}
