// Reglas de negocio del flujo de compra

export const PEDIDO_MINIMO_DOMICILIO = 100 // MXN
export const ENVIO_ZONA_CENTRO = 25 // MXN

export const MENSAJE_MINIMO_DOMICILIO =
  'El servicio a domicilio está disponible únicamente en pedidos de $100 o más.'

export const NOTA_SOLICITUD =
  'Nota: Entiendo que este mensaje es únicamente una solicitud de pedido. ' +
  'Esperaré la confirmación de disponibilidad, costo de envío (si aplica) y aceptación ' +
  'por parte del establecimiento antes de considerar mi pedido como confirmado.'

// Genera el mensaje de WhatsApp con formato limpio
export function buildCartMessage({ items, subtotal, discount, coupon, total, cliente }) {
  const L = []

  L.push('🍓 *Nuevo pedido — Toppifresa*')
  L.push('')
  L.push('*Cliente:*')
  L.push(cliente.nombre)
  L.push(`*Teléfono:* +52 ${cliente.telefono}`)
  L.push('')
  L.push('*Productos:*')
  items.forEach((i) => {
    L.push(`• ${i.qty}x ${i.name} — $${i.price * i.qty}`)
    if (i.note?.trim()) L.push(`   📝 ${i.note.trim()}`)
  })
  L.push('')
  L.push(`*Subtotal:* $${subtotal}`)
  if (discount > 0 && coupon) {
    L.push(`*Cupón ${coupon.code}:* −$${discount}`)
  }

  if (cliente.entrega === 'domicilio') {
    if (cliente.zona === 'centro') {
      L.push(`*Envío:* $${ENVIO_ZONA_CENTRO} (Zona Centro)`)
      L.push(`*Total:* $${total + ENVIO_ZONA_CENTRO}`)
    } else {
      L.push('*Envío:* Se cotizará según la ubicación')
      L.push(`*Total:* $${total} + envío por cotizar`)
    }
  } else {
    L.push(`*Total:* $${total}`)
  }

  L.push('')
  L.push('*Entrega:*')
  if (cliente.entrega === 'domicilio') {
    L.push(`A domicilio (${cliente.zona === 'centro' ? 'Zona Centro' : 'Fuera de Zona Centro'})`)
    L.push('')
    L.push('*Dirección:*')
    L.push(cliente.direccion.trim())
    if (cliente.referencias?.trim()) {
      L.push(`*Referencias:* ${cliente.referencias.trim()}`)
    }
  } else {
    L.push('Recoger en establecimiento')
  }

  if (cliente.hora) {
    L.push('')
    L.push(`*Hora deseada:* ${cliente.hora}`)
  }

  L.push('')
  L.push('*Forma de pago:*')
  L.push(cliente.pago)

  if (cliente.observaciones?.trim()) {
    L.push('')
    L.push('*Observaciones:*')
    L.push(cliente.observaciones.trim())
  }

  L.push('')
  L.push(`_${NOTA_SOLICITUD}_`)

  return L.join('\n')
}
