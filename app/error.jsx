'use client'

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-8 text-center bg-app-bg">
      <span className="text-7xl mb-5">😵</span>
      <h1 className="font-black text-app-text text-2xl mb-2">Algo salió mal</h1>
      <p className="text-app-muted text-sm leading-relaxed mb-8 max-w-[280px]">
        Ocurrió un error inesperado. Intenta de nuevo; si el problema sigue, escríbenos por WhatsApp.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="bg-primary text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-fab tap-scale"
        >
          Reintentar
        </button>
        <a
          href="/"
          className="bg-white text-app-text border-2 border-app-border font-bold text-sm px-6 py-3.5 rounded-2xl tap-scale"
        >
          Ir al inicio
        </a>
      </div>
    </div>
  )
}
