// ⏰ HORARIO DEL NEGOCIO
// Si el horario cambia, edita SOLO este archivo.
//
// Días: 0 = domingo, 1 = lunes, 2 = martes, 3 = miércoles,
//       4 = jueves, 5 = viernes, 6 = sábado
// Horas en formato 24h (17 = 5 PM, 22 = 10 PM)

export const HORARIO_SEMANAL = {
  6: { abre: 17, cierra: 22 }, // Sábado 5:00 PM – 10:00 PM
  0: { abre: 17, cierra: 22 }, // Domingo 5:00 PM – 10:00 PM
}

// Cada cuántos minutos se ofrece un horario de entrega en el checkout
export const INTERVALO_MINUTOS = 30

// Lo que se muestra en la página de Ubicación
export const HORARIO_DISPLAY = [
  { day: 'Sábado', hours: '5:00 PM – 10:00 PM' },
  { day: 'Domingo', hours: '5:00 PM – 10:00 PM' },
]

export const MENSAJE_CERRADO =
  'En este momento nos encontramos fuera de horario. Puedes enviarnos tu pedido y será atendido en nuestro siguiente horario de servicio.'

/* ---------- Helpers (no editar) ---------- */

function formato12h(totalMin) {
  const h24 = Math.floor(totalMin / 60)
  const m = totalMin % 60
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

// ¿El negocio está abierto en este momento?
export function estaAbierto(date = new Date()) {
  const h = HORARIO_SEMANAL[date.getDay()]
  if (!h) return false
  const mins = date.getHours() * 60 + date.getMinutes()
  return mins >= h.abre * 60 && mins < h.cierra * 60
}

// Horarios de entrega que quedan disponibles hoy (desde ahora hasta el cierre)
export function horariosDisponibles(date = new Date()) {
  const h = HORARIO_SEMANAL[date.getDay()]
  if (!h) return []
  const ahora = date.getHours() * 60 + date.getMinutes()
  const inicio = Math.max(
    h.abre * 60,
    Math.ceil(ahora / INTERVALO_MINUTOS) * INTERVALO_MINUTOS,
  )
  const fin = h.cierra * 60
  const slots = []
  for (let t = inicio; t <= fin - INTERVALO_MINUTOS; t += INTERVALO_MINUTOS) {
    slots.push(formato12h(t))
  }
  return slots
}
