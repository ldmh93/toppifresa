/** @type {import('next').NextConfig} */

// Cabeceras de seguridad.
//
// Son baratas y cierran clases enteras de ataque. No hay Content-Security-
// Policy todavía porque Next inyecta scripts en línea y hacerlo bien exige
// nonces por petición; ponerla mal rompería la app sin ganar nada.
const cabecerasSeguridad = [
  // Impide que el navegador "adivine" un tipo distinto al declarado, que es
  // como un .txt subido por alguien acaba ejecutándose como script.
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Nadie puede meter el sitio en un <iframe> ajeno (clickjacking): un botón
  // invisible encima de "Enviar pedido" sería un problema real.
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

  // Al salir hacia WhatsApp o Instagram solo se manda el dominio, nunca la
  // ruta completa que estaba viendo la clienta.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // La app no necesita cámara, micrófono ni ubicación. Si algún script de
  // terceros lo intentara, el navegador lo bloquea.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

const nextConfig = {
  reactStrictMode: true,

  // Oculta la versión exacta de Next en las respuestas: no arregla fallos,
  // pero evita regalarle al escáner de turno la lista de exploits aplicables.
  poweredByHeader: false,

  images: {
    // `domains` quedó obsoleto en Next 14 a favor de `remotePatterns`.
    //
    // Está vacío a propósito: hoy ningún producto usa `imageUrl` y el menú
    // funciona con emojis. Cuando se suban fotos reales, hay que añadir aquí
    // el host exacto (por ejemplo el de Supabase Storage o Cloudinary).
    //
    // Dejarlo vacío también es lo que mantiene fuera de alcance el aviso de
    // seguridad del optimizador de imágenes: sin patrones remotos permitidos,
    // no hay origen externo que se pueda usar para saturarlo.
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: cabecerasSeguridad,
      },
      {
        // Los SVG de marca y los iconos no cambian: se cachean un año. El
        // nombre del archivo es estable, así que si algún día cambian hay que
        // renombrarlos o purgar la caché de Vercel.
        source: '/brand/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

module.exports = nextConfig
