import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase/server'

// API del panel de dinámicas.
//
// Vive dentro de /admin a propósito: el matcher de middleware.js cubre
// '/admin/:path*', así que estas rutas ya quedan detrás del Basic Auth del
// panel. Si se movieran a /api/... quedarían públicas.

export const dynamic = 'force-dynamic'

const SIN_CONFIG = NextResponse.json(
  { error: 'Falta configurar Supabase. Revisa SUPABASE_URL y SUPABASE_SECRET_KEY en .env.local.' },
  { status: 503 },
)

const CAMPOS_SORTEO = 'id, premio, descripcion, cierra_en, estado, ganador_id, sorteado_en, created_at'

/** Lista de sorteos, participantes del seleccionado y su ganador. */
export async function GET(req) {
  const db = getSupabase()
  if (!db) return SIN_CONFIG

  try {
    const { data: sorteos, error: e1 } = await db
      .from('sorteos')
      .select(CAMPOS_SORTEO)
      .order('created_at', { ascending: false })
    if (e1) throw e1

    // Por defecto se muestra el abierto; si no hay, el más reciente.
    const pedido = req.nextUrl.searchParams.get('sorteo')
    const sorteo =
      (pedido && sorteos.find((s) => s.id === pedido)) ||
      sorteos.find((s) => s.estado === 'abierto') ||
      sorteos[0] ||
      null

    let participantes = []
    if (sorteo) {
      const { data, error: e2 } = await db
        .from('participantes')
        .select('id, nombre, telefono, created_at')
        .eq('sorteo_id', sorteo.id)
        .order('created_at', { ascending: false })
      if (e2) throw e2
      participantes = data
    }

    const ganador = sorteo?.ganador_id
      ? participantes.find((p) => p.id === sorteo.ganador_id) || null
      : null

    return NextResponse.json({ sorteos, sorteo, participantes, ganador })
  } catch (err) {
    console.error('[admin/dinamicas] GET:', err)
    return NextResponse.json({ error: 'No se pudieron cargar los datos.' }, { status: 500 })
  }
}

/** Acciones: crear un sorteo, elegir ganador y cerrar el mes. */
export async function POST(req) {
  const db = getSupabase()
  if (!db) return SIN_CONFIG

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const { accion, sorteo_id: sorteoId } = body ?? {}

  try {
    // ---- Crear el sorteo del mes ------------------------------------
    if (accion === 'crear') {
      const premio = String(body.premio ?? '').trim().slice(0, 120)
      if (premio.length < 2) {
        return NextResponse.json({ error: 'Escribe el premio del sorteo.' }, { status: 400 })
      }

      const { data, error } = await db
        .from('sorteos')
        .insert({
          premio,
          descripcion: String(body.descripcion ?? '').trim().slice(0, 200) || null,
          cierra_en: body.cierra_en || null,
        })
        .select(CAMPOS_SORTEO)
        .single()

      if (error) {
        // Lo impone el índice sorteos_un_solo_abierto.
        if (error.code === '23505') {
          return NextResponse.json(
            { error: 'Ya hay un sorteo abierto. Ciérralo antes de crear el siguiente.' },
            { status: 409 },
          )
        }
        throw error
      }
      return NextResponse.json({ ok: true, sorteo: data }, { status: 201 })
    }

    if (!sorteoId) {
      return NextResponse.json({ error: 'Falta indicar el sorteo.' }, { status: 400 })
    }

    // ---- Elegir ganador ---------------------------------------------
    if (accion === 'sortear') {
      const { data: participantes, error: e1 } = await db
        .from('participantes')
        .select('id, nombre, telefono')
        .eq('sorteo_id', sorteoId)
      if (e1) throw e1

      if (!participantes.length) {
        return NextResponse.json(
          { error: 'Este sorteo todavía no tiene participantes.' },
          { status: 409 },
        )
      }

      const ganador = participantes[Math.floor(Math.random() * participantes.length)]

      // Queda guardado en la base: aunque cierres la página o se vaya la luz,
      // el ganador y la fecha del sorteo no se pierden.
      const { error: e2 } = await db
        .from('sorteos')
        .update({ ganador_id: ganador.id, sorteado_en: new Date().toISOString() })
        .eq('id', sorteoId)
      if (e2) throw e2

      return NextResponse.json({ ok: true, ganador })
    }

    // ---- Cerrar el mes ----------------------------------------------
    if (accion === 'cerrar') {
      const { error } = await db
        .from('sorteos')
        .update({ estado: 'cerrado' })
        .eq('id', sorteoId)
      if (error) throw error

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Acción desconocida.' }, { status: 400 })
  } catch (err) {
    console.error('[admin/dinamicas] POST:', err)
    return NextResponse.json({ error: 'No se pudo completar la acción.' }, { status: 500 })
  }
}
