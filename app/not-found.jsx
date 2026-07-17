import Link from 'next/link'

export const metadata = {
  title: 'Página no encontrada',
}

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-8 text-center bg-app-bg">
      <span className="text-7xl mb-5">🍓</span>
      <h1 className="font-black text-app-text text-2xl mb-2">¡Ups! Página no encontrada</h1>
      <p className="text-app-muted text-sm leading-relaxed mb-8 max-w-[280px]">
        Parece que esta página se derritió. Regresa al inicio para seguir antojándote.
      </p>
      <Link
        href="/"
        className="bg-primary text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-fab tap-scale"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
