import Script from 'next/script'
import { Fraunces, Nunito } from 'next/font/google'
import '../styles/globals.css'

const SITE_URL = 'https://toppifresa.vercel.app'

// Tipografías.
//
// El branding oficial usa Mora (serif) y Bubbleboddy Neue (redondeada), que
// son de licencia comercial y no vienen en la carpeta de marca. Estas dos son
// las equivalentes libres más cercanas y se auto-hospedan: next/font descarga
// los archivos en build, así que no hay ninguna petición a Google en runtime
// (mejor privacidad y un salto de red menos en móvil).
//
// El logotipo conserva la tipografía real porque va como SVG.
const display = Fraunces({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-display',
  display: 'swap',
})

const sans = Nunito({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

// Sin la variable definida no se carga nada: así en local no se ensucian
// las métricas de producción con visitas de desarrollo.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata = {
  title: {
    default: 'Toppifresa — Tu dosis de felicidad diaria',
    template: '%s | Toppifresa',
  },
  description:
    'Fresas con crema y toppings premium en Acámbaro, Guanajuato. Arma tu Toppi y pide por WhatsApp.',
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
    title: 'Toppifresa — Tu dosis de felicidad diaria',
    description: 'Fresas con crema y toppings premium en Acámbaro, Guanajuato.',
    siteName: 'Toppifresa',
    images: [{ url: '/icons/icon-512x512.png', width: 512, height: 512, alt: 'Toppifresa' }],
  },
  twitter: {
    card: 'summary',
    title: 'Toppifresa — Tu dosis de felicidad diaria',
    description: 'Fresas con crema y toppings premium en Acámbaro, Guanajuato.',
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
  themeColor: '#9C0B0A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

// Datos estructurados: ayudan a Google a mostrar horario, dirección y teléfono
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'IceCreamShop',
  name: 'Toppifresa',
  slogan: 'Tu dosis de felicidad diaria',
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
    <html lang="es-MX" className={`${display.variable} ${sans.variable}`}>
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
        {/* Salto de navegación: primer tabulador de la página, para que quien
            navega con teclado no tenga que recorrer todo el menú. */}
        <a
          href="#contenido"
          className="sr-only-focusable absolute left-4 top-4 z-[100] rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"
        >
          Saltar al contenido
        </a>

        <div className="app-shell">{children}</div>

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
