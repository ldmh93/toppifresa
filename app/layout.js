import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata = {
  title: "Nail Studio | Dashboard Pro",
  description: "Panel de control profesional para tu estudio de uñas",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nail Studio",
  },
}

export const viewport = {
  themeColor: "#d4af37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="min-h-full antialiased bg-[#0a0a0a] text-white">
        {children}
      </body>
    </html>
  )
}
