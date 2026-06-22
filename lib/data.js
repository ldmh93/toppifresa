// Reemplaza WHATSAPP_NUMBER con tu numero real (codigo pais + numero, sin +)
export const WHATSAPP_NUMBER = "524611234567"
export const WHATSAPP_MESSAGE = encodeURIComponent("Hola, quiero pedir una Toppifresa 🍓")
export const INSTAGRAM_URL = "https://instagram.com/toppifresa"
export const FACEBOOK_URL = "https://facebook.com/toppifresa"

export const PRODUCTOS = [
  { id: 1, nombre: "ToppiTradicional", descripcion: "Fresas frescas con crema suave y nuestra salsa especial de la casa", bg: "bg-gradient-to-br from-red-500 to-pink-500", emoji: "🍓", popular: true },
  { id: 2, nombre: "ToppiOreo", descripcion: "Fresas con crema y galleta Oreo molida bien cargada", bg: "bg-gradient-to-br from-gray-800 to-gray-600", emoji: "🖤", popular: true },
  { id: 3, nombre: "ToppiDuo", descripcion: "Lo mejor de dos sabores en una sola copa irresistible", bg: "bg-gradient-to-br from-pink-500 to-rose-600", emoji: "💝", popular: false },
  { id: 4, nombre: "ToppiAvellana", descripcion: "Con crema de avellana para los mas golosos", bg: "bg-gradient-to-br from-amber-600 to-orange-500", emoji: "🍫", popular: false },
  { id: 5, nombre: "ToppiBubulubu", descripcion: "Con el sabor clasico y nostalgico del Bubulubu", bg: "bg-gradient-to-br from-pink-400 to-rose-500", emoji: "🍬", popular: false },
  { id: 6, nombre: "ToppiMazapan", descripcion: "Con ese sabor unico de mazapan de cacahuate", bg: "bg-gradient-to-br from-yellow-400 to-amber-500", emoji: "🥜", popular: false },
  { id: 7, nombre: "ToppiPicosito", descripcion: "Para los que les gusta el dulce con un toque de picante", bg: "bg-gradient-to-br from-red-600 to-orange-500", emoji: "🌶️", popular: false },
  { id: 8, nombre: "ToppiFrootLoops", descripcion: "Con cereal Froot Loops colorido y crujiente", bg: "bg-gradient-to-br from-purple-500 to-pink-400", emoji: "🌈", popular: false },
  { id: 9, nombre: "ToppiChachitos", descripcion: "Con la textura unica e irresistible de los Chachitos", bg: "bg-gradient-to-br from-orange-400 to-yellow-500", emoji: "🧡", popular: false },
  { id: 10, nombre: "ToppiGranola", descripcion: "La opcion saludable y deliciosa con granola y miel", bg: "bg-gradient-to-br from-green-500 to-emerald-400", emoji: "🌿", popular: false },
]

export const TOPPINGS = [
  { nombre: "Almendra", emoji: "🥜" },
  { nombre: "Nuez", emoji: "🌰" },
  { nombre: "Chispas de chocolate", emoji: "🍫" },
  { nombre: "Arandanos", emoji: "🫐" },
  { nombre: "Coco", emoji: "🥥" },
  { nombre: "Lunetas", emoji: "🟣" },
  { nombre: "Galleta molida", emoji: "🍪" },
  { nombre: "Granola", emoji: "🌾" },
  { nombre: "Froot Loops", emoji: "🌈" },
  { nombre: "Chachitos", emoji: "🧡" },
  { nombre: "Choco Krispis", emoji: "🍩" },
  { nombre: "Nesquik", emoji: "🐰" },
  { nombre: "Amaranto", emoji: "⭐" },
]

export const PROMOCIONES = [
  { id: 1, titulo: "Mini Hot Cakes + Fresas", descripcion: "Orden de mini hot cakes con nuestras fresas especiales", precio: "$100", badge: "HOT", bg: "bg-gradient-to-r from-orange-500 to-red-500", emoji: "🥞" },
  { id: 2, titulo: "Combo del Dia", descripcion: "ToppiTradicional mas bebida a elegir", precio: "$80", badge: "OFERTA", bg: "bg-gradient-to-r from-pink-500 to-rose-600", emoji: "🎉" },
  { id: 3, titulo: "2x1 en ToppiDuo", descripcion: "Lleva dos ToppiDuo al precio de uno. Solo por tiempo limitado", precio: "$110", badge: "2x1", bg: "bg-gradient-to-r from-purple-500 to-pink-500", emoji: "💕" },
]

export const STORIES = [
  { id: 1, producto: "ToppiTradicional", descripcion: "El clasico que siempre pides", emoji: "🍓", bg: "bg-gradient-to-br from-red-500 via-pink-500 to-rose-400" },
  { id: 2, producto: "ToppiOreo", descripcion: "El favorito de los amantes del chocolate", emoji: "🖤", bg: "bg-gradient-to-br from-gray-900 via-gray-700 to-gray-600" },
  { id: 3, producto: "ToppiAvellana", descripcion: "Cremoso y adictivo. Pruebalo una vez", emoji: "🍫", bg: "bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-400" },
  { id: 4, producto: "ToppiPicosito", descripcion: "Para los que se atreven a algo diferente", emoji: "🌶️", bg: "bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400" },
]
