// Exportación a Excel (CSV) de los participantes de un sorteo.
//
// Los datos ya no viven en el navegador: llegan desde Supabase a través de
// /admin/api/dinamicas. Aquí solo se les da formato para descargarlos.

export function participantesToCSV(lista = []) {
  const header = ['Nombre', 'WhatsApp', 'Fecha de registro']
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const rows = lista.map((p) => [
    p.nombre,
    `+52 ${p.telefono}`,
    new Date(p.created_at).toLocaleString('es-MX'),
  ])
  return [header, ...rows].map((r) => r.map(escape).join(',')).join('\r\n')
}

export function descargarParticipantesCSV(lista = [], etiqueta = '') {
  if (typeof window === 'undefined' || !lista.length) return

  // BOM (﻿) para que Excel lea bien los acentos
  const csv = '﻿' + participantesToCSV(lista)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const sufijo = etiqueta
    ? etiqueta.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    : new Date().toISOString().slice(0, 10)

  const a = document.createElement('a')
  a.href = url
  a.download = `participantes-toppifresa-${sufijo}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
