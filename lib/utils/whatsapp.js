const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '524611234567'

export function buildOrderMessage({ productName, price, extras = '' }) {
  const lines = [
    `Hola! 👋 Quiero hacer un pedido en Toppifresa:`,
    ``,
    `🍓 *${productName}*`,
    `💰 Precio: $${price}`,
  ]

  if (extras) {
    lines.push(`📝 Nota: ${extras}`)
  }

  lines.push(``, `¿Está disponible? 😊`)

  return lines.join('\n')
}

export function buildPromoMessage(message) {
  return message
}

export function buildDynamicMessage({ name, phone }) {
  return `Hola! 👋 Me llamo *${name}* y quiero participar en la dinámica.\nMi número es: ${phone}`
}

export function buildLocationMessage() {
  return `Hola! 📍 ¿Cómo llego a Toppifresa? ¿Cuáles son sus horarios?`
}

export function buildGeneralMessage(text) {
  return text || `Hola! 👋 Quiero hacer un pedido en Toppifresa 🍓`
}

export function getWhatsAppURL(message) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function openWhatsApp(message) {
  const url = getWhatsAppURL(message)
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
