"use client"
import { useState } from "react"
import BottomTabs from "@/components/app/BottomTabs"
import FloatingWhatsApp from "@/components/FloatingWhatsApp"
import Home from "@/components/sections/Home"
import Products from "@/components/sections/Products"
import Promotions from "@/components/sections/Promotions"
import Toppings from "@/components/sections/Toppings"
import Coupons from "@/components/sections/Coupons"
import Location from "@/components/sections/Location"

const SECCIONES = {
  inicio: Home,
  productos: Products,
  promos: Promotions,
  toppings: Toppings,
  dinamicas: Coupons,
  ubicacion: Location,
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("inicio")
  const Seccion = SECCIONES[activeTab] || Home

  return (
    <main className="bg-rose-50 min-h-screen pb-20">
      <Seccion onTabChange={setActiveTab} />
      <FloatingWhatsApp />
      <BottomTabs activeTab={activeTab} onChange={setActiveTab} />
    </main>
  )
}
