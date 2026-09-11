'use client'

import { useCallback, useEffect, useState } from 'react'

// Borradores del panel.
//
// El catálogo real vive en archivos de código. Mientras editas, lo que haces
// se guarda en este navegador para que no pierdas el trabajo si recargas o se
// cierra la pestaña por accidente. No es la app pública: para publicar hay que
// copiar el bloque generado al archivo correspondiente.

const PREFIJO = 'toppifresa_borrador_'

/**
 * Estado que sobrevive a recargas, guardado en localStorage.
 *
 * @param {string} nombre        Identificador del borrador (ej. 'productos').
 * @param {any}    valorOriginal Datos publicados hoy, usados como base.
 * @returns {[any, Function, {hidratado: boolean, hayBorrador: boolean, descartar: Function}]}
 */
export function useBorrador(nombre, valorOriginal) {
  const clave = PREFIJO + nombre
  const [valor, setValor] = useState(valorOriginal)
  const [hidratado, setHidratado] = useState(false)
  const [hayBorrador, setHayBorrador] = useState(false)

  // Se lee después de montar: en el servidor no existe localStorage y leerlo
  // durante el render provocaría un desajuste de hidratación.
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(clave)
      if (guardado) {
        const datos = JSON.parse(guardado)
        setValor(datos)
        setHayBorrador(true)
      }
    } catch {
      // Un borrador corrupto no debe tumbar el panel: se ignora y se sigue
      // con los datos publicados.
    }
    setHidratado(true)
  }, [clave])

  useEffect(() => {
    if (!hidratado) return
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor))
    } catch {
      // Sin espacio o en modo privado: se pierde el borrador, no la sesión.
    }
  }, [clave, valor, hidratado])

  const descartar = useCallback(() => {
    try {
      window.localStorage.removeItem(clave)
    } catch {}
    setValor(valorOriginal)
    setHayBorrador(false)
  }, [clave, valorOriginal])

  // Deja de anunciarse como "borrador" en cuanto se descarta y se vuelve a
  // editar: solo importa si difiere de lo publicado.
  const actualizar = useCallback((siguiente) => {
    setValor(siguiente)
    setHayBorrador(true)
  }, [])

  return [valor, actualizar, { hidratado, hayBorrador, descartar }]
}
