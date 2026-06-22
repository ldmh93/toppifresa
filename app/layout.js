import { Geist } from "next/font/google"
import "./globals.css"
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata = {
  title: "Toppifresa 🍓 | Fresas con crema en Acambaro",
  description: "Las mejores fresas con crema y toppings en Acambaro, Guanajuato",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Toppifresa",
  },
}

export const viewport = {
  themeColor: "#e91e63",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="min-h-full antialiased">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
