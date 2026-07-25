// page.jsx es un componente de cliente ('use client') y por eso no puede
// exportar `metadata`. Este layout mínimo existe solo para dar título y
// descripción propios a la ruta; no envuelve ni altera nada del render.
export const metadata = {
  title: 'Ubicación',
  description:
    'Toppifresa está en Plaza Alcasa (Cinepolis), Local #1, Acámbaro, Guanajuato. Sábado y domingo de 5:00 PM a 10:00 PM.',
}

export default function UbicacionLayout({ children }) {
  return children
}
