export default function DevCredit() {
  return (
    <footer className="mt-10 px-5 pb-3 text-center">
      <div className="border-t border-app-border/60 pt-4">
        {/* Ancho acotado para no chocar con el botón flotante de WhatsApp */}
        <div className="max-w-[280px] mx-auto">
          <p className="text-[11px] leading-relaxed text-app-muted/70">
            Diseño y desarrollo:{' '}
            <span className="font-semibold text-app-muted/90">Luis D. Maldonado</span>
          </p>
          <p className="text-[11px] leading-relaxed text-app-muted/70 mt-0.5">
            Soluciones digitales y desarrollo web
            <span className="mx-1.5">·</span>
            <a
              href="https://wa.me/524171279042"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-app-border hover:text-app-muted transition-colors"
            >
              417 127 9042
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
