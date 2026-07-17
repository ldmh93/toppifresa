// Cupones de descuento.
// Para activar un cupón, agrégalo a la lista:
//   { code: 'TOPPI10', type: 'percent', value: 10 }  → 10% de descuento
//   { code: 'REGALO20', type: 'amount', value: 20 }  → $20 de descuento
export const cupones = [
  // { code: 'TOPPI10', type: 'percent', value: 10 },
]

export function validarCupon(code) {
  const clean = (code || '').trim().toUpperCase()
  if (!clean) return null
  return cupones.find((c) => c.code.toUpperCase() === clean) || null
}
