import Script from 'next/script'
import '../styles/globals.css'

const SITE_URL = 'https://toppifresa.vercel.app'

// Sin la variable definida no se carga nada: así en local no se ensucian
// las métricas de producción con visitas de desarrollo.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata = {
  title: {
    default: 'Toppifresa 🍓',
    template: '%s | Toppifresa',
  },
  description: 'Las mejores fresas con crema y toppings en Acámbaro, Guanajuato. Pide por WhatsApp.',
  keywords: ['fresas con crema', 'toppings', 'acámbaro', 'guanajuato', 'postres', 'toppifresa'],
  authors: [{ name: 'Toppifresa' }],
  creator: 'Toppifresa',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: SITE_URL,
    title: 'Toppifresa 🍓',
    description: 'Las mejores fresas con crema y toppings en Acámbaro, Guanajuato.',
    siteName: 'Toppifresa',
    images: [{ url: '/icons/icon-512x512.png', width: 512, height: 512, alt: 'Toppifresa' }],
  },
  twitter: {
    card: 'summary',
    title: 'Toppifresa 🍓',
    description: 'Las mejores fresas con crema y toppings en Acámbaro, Guanajuato.',
    images: ['/icons/icon-512x512.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Toppifresa',
  },
  formatDetection: {
    telephone: false,
  },
}

// No se bloquea el zoom: impedirlo incumple WCAG 1.4.4 y deja fuera a
// quien necesita ampliar para leer precios o direcciones.
export const viewport = {
  themeColor: '#D63864',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

// Datos estructurados: ayudan a Google a mostrar horario, dirección y teléfono
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'IceCreamShop',
  name: 'Toppifresa',
  description: 'Fresas con crema y toppings premium en Acámbaro, Guanajuato.',
  url: SITE_URL,
  telephone: '+52-443-942-5620',
  servesCuisine: 'Postres',
  priceRange: '$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plaza Alcasa (Cinepolis), Local #1',
    addressLocality: 'Acámbaro',
    addressRegion: 'Guanajuato',
    addressCountry: 'MX',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '17:00',
      closes: '22:00',
    },
  ],
  image: `${SITE_URL}/icons/icon-512x512.png`,
}

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <div className="app-shell">
          {children}
        </div>

        {/* Google Analytics 4. afterInteractive: carga tras pintar la página,
            para no retrasar el contenido ni castigar el LCP en móvil. */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
