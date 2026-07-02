import '../styles/globals.css'

export const metadata = {
  title: {
    default: 'Toppifresa 🍓',
    template: '%s | Toppifresa',
  },
  description: 'Las mejores fresas con crema y toppings en Acámbaro, Guanajuato. Pide por WhatsApp.',
  keywords: ['fresas con crema', 'toppings', 'acámbaro', 'guanajuato', 'postres', 'toppifresa'],
  authors: [{ name: 'Toppifresa' }],
  creator: 'Toppifresa',
  metadataBase: new URL('https://toppifresa.com'),
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://toppifresa.com',
    title: 'Toppifresa 🍓',
    description: 'Las mejores fresas con crema y toppings en Acámbaro, Guanajuato.',
    siteName: 'Toppifresa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toppifresa 🍓',
    description: 'Las mejores fresas con crema y toppings en Acámbaro, Guanajuato.',
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

export const viewport = {
  themeColor: '#b5191a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  )
}
