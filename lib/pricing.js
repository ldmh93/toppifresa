// Cambia este número por el tuyo real (formato: 521 + 10 dígitos)
export const WHATSAPP_NUMBER = "5215512345678"

export const SERVICES = {
  fullset:  { label: "Full Set",  base: 350 },
  retoque:  { label: "Retoque",   base: 200 },
  gel:      { label: "Gel",       base: 280 },
  acrilico: { label: "Acrílico",  base: 320 },
}

export const SHAPES = {
  cuadrada: { label: "Cuadrada",  extra: 0  },
  almendra: { label: "Almendra",  extra: 30 },
  coffin:   { label: "Coffin",    extra: 50 },
  stiletto: { label: "Stiletto",  extra: 60 },
}

export const LENGTHS = {
  xs: { label: "XS", extra: 0  },
  s:  { label: "S",  extra: 20 },
  m:  { label: "M",  extra: 40 },
  l:  { label: "L",  extra: 60 },
  xl: { label: "XL", extra: 80 },
}

export const EXTRAS = {
  chrome:      { label: "Chrome",      price: 80  },
  ombre:       { label: "Ombré",       price: 100 },
  cateye:      { label: "Cat Eye",     price: 90  },
  encapsulado: { label: "Encapsulado", price: 120 },
  marble:      { label: "Marble",      price: 110 },
}

export function calculateTotal({ service, shape, length, extras = [] }) {
  const base        = SERVICES[service]?.base  ?? 0
  const shapeExtra  = SHAPES[shape]?.extra     ?? 0
  const lengthExtra = LENGTHS[length]?.extra   ?? 0
  const extrasSum   = extras.reduce((s, e) => s + (EXTRAS[e]?.price ?? 0), 0)
  return base + shapeExtra + lengthExtra + extrasSum
}

export function buildWhatsAppMessage({ service, shape, length, extras, total, clientName }) {
  const svc    = SERVICES[service]?.label  ?? ""
  const shp    = SHAPES[shape]?.label      ?? ""
  const len    = LENGTHS[length]?.label    ?? ""
  const xNames = extras.map(e => EXTRAS[e]?.label).filter(Boolean).join(", ")

  let msg = `💅 *Cotización de Uñas*\n\n`
  if (clientName) msg += `Hola ${clientName}! Aquí tu cotización:\n\n`
  msg += `✨ Servicio: ${svc}\n`
  msg += `💎 Forma: ${shp}\n`
  msg += `📏 Longitud: ${len}\n`
  if (xNames) msg += `🎨 Extras: ${xNames}\n`
  msg += `\n💰 *Total: $${total} MXN*\n\n`
  msg += `¡Me gustaría agendar mi cita! 🗓`

  return encodeURIComponent(msg)
}
