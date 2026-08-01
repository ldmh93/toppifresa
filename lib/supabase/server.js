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

/** ¿Ya están configuradas las credenciales? */
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
  })
}

/** Sorteo abierto actualmente, o null si no hay ninguno. */
export async function getSorteoAbierto(db) {
  const { data, error } = await db
    .from('sorteos')
    .select('id, premio, descripcion, cierra_en, estado, created_at')
    .eq('estado', 'abierto')
    .maybeSingle()

  if (error) throw error
  return data
}
