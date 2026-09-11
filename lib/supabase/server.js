import { createClient } from '@supabase/supabase-js'

// Cliente de Supabase para usar SOLO en el servidor (route handlers y server
// components). Usa la llave secreta (sb_secret_…), que ignora las políticas
// RLS. En proyectos viejos esta llave se llamaba service_role.
//
// Ninguna de estas dos variables lleva el prefijo NEXT_PUBLIC_, así que Next
// nunca las incluye en el bundle del navegador. Si alguna vez alguien mueve
// este archivo a un componente 'use client', el import fallará al compilar,
// que es justo lo que queremos.

const URL = process.env.SUPABASE_URL
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY

// Cuánto se espera a la base antes de rendirse.
//
// Sin esto, si el proyecto de Supabase está pausado o borrado, cada petición
// se queda ~50 segundos colgada: undici reintenta un timeout de conexión de
// 10 s contra varias direcciones. El cliente veía un formulario congelado casi
// un minuto y luego un error genérico. Ocho segundos es de sobra para una
// consulta sana y falla rápido cuando la base no está.
const TIEMPO_LIMITE_MS = 8000

/** ¿Están configuradas las credenciales? */
export const supabaseListo = Boolean(URL && SECRET_KEY)

/**
 * Devuelve el cliente, o null si falta configuración.
 *
 * Devolver null en vez de lanzar un error mantiene el sitio de pie mientras
 * las credenciales no existen: la página de dinámicas sigue mostrándose y el
 * formulario avisa con claridad en lugar de tronar con una pantalla de error.
 */
export function getSupabase() {
  if (!supabaseListo) return null

  return createClient(URL, SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init = {}) =>
        fetch(input, { ...init, signal: AbortSignal.timeout(TIEMPO_LIMITE_MS) }),
    },
  })
}

/**
 * ¿El fallo fue por no poder llegar a la base?
 *
 * Sirve para distinguir "la base no responde" (problema de infraestructura,
 * hay que avisar al negocio) de "la consulta salió mal" (problema de datos).
 */
export function esErrorDeConexion(err) {
  const texto = `${err?.message ?? ''} ${err?.details ?? ''} ${err?.cause?.message ?? ''}`
  return /fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|timeout|aborted|TimeoutError|EAI_AGAIN|tardó demasiado/i.test(
    texto,
  )
}

/**
 * Pone un techo al tiempo que puede tardar una consulta.
 *
 * El `fetch` con AbortSignal de arriba debería bastar, pero dentro del
 * servidor de Next no siempre se aplica: supabase-js no usa nuestro fetch en
 * todos sus caminos internos, y medido contra un proyecto caído la petición
 * seguía tardando ~30 s. Esta carrera garantiza el límite pase lo que pase.
 *
 * La petición perdedora sigue viva en segundo plano hasta que el sistema la
 * corta sola; no pasa nada porque nadie espera ya su resultado.
 */
export function conLimite(promesa, ms = TIEMPO_LIMITE_MS) {
  return Promise.race([
    promesa,
    new Promise((_, rechazar) =>
      setTimeout(
        () => rechazar(new Error(`La base de datos tardó demasiado (más de ${ms / 1000}s).`)),
        ms,
      ),
    ),
  ])
}

/** Sorteo abierto actualmente, o null si no hay ninguno. */
export async function getSorteoAbierto(db) {
  const { data, error } = await conLimite(
    db
      .from('sorteos')
      .select('id, premio, descripcion, cierra_en, estado, created_at')
      .eq('estado', 'abierto')
      .maybeSingle(),
  )

  if (error) throw error
  return data
}
