// Almacenamiento local de participantes del sorteo (sin backend).
// Los registros se guardan en el navegador (localStorage) del dispositivo
// donde se llena el formulario. Desde /admin/dinamicas se pueden ver y
// descargar como Excel (CSV).

const KEY = 'toppifresa_participantes'

export function getParticipantes() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addParticipante({ nombre, telefono }) {
  if (typeof window === 'undefined') return
  const list = getParticipantes()
  list.push({ nombre, telefono, fecha: new Date().toISOString() })
  window.localStorage.setItem(KEY, JSON.stringify(list))
}

export function clearParticipantes() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEY)
}

export function participantesToCSV() {
  const list = getParticipantes()
  const header = ['Nombre', 'WhatsApp', 'Fecha de registro']
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`
  const rows = list.map((p) => [
    p.nombre,
    `+52 ${p.telefono}`,
    new Date(p.fecha).toLocaleString('es-MX'),
  ])
  return [header, ...rows].map((r) => r.map(escape).join(',')).join('\r\n')
}

export function descargarParticipantesCSV() {
  if (typeof window === 'undefined') return
  // BOM (﻿) para que Excel lea bien los acentos
  const csv = '﻿' + participantesToCSV()
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const fecha = new Date().toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `participantes-toppifresa-${fecha}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
