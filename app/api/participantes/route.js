import { NextResponse } from 'next/server'
import { getSupabase, getSorteoAbierto } from '@/lib/supabase/server'

// Registro público al sorteo. Es el único endpoint abierto a cualquiera,
// así que valida todo lo que recibe y nunca devuelve datos de otras personas.

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const db = getSupabase()
  if (!db) {
    return NextResponse.json(
      { error: 'El registro no está disponible por ahora. Escríbenos por WhatsApp.' },
      { status: 503 },
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const nombre = String(body?.nombre ?? '').trim().slice(0, 80)
  const telefono = String(body?.telefono ?? '').replace(/\D/g, '')

  if (nombre.length < 2) {
    return NextResponse.json({ error: 'Escribe tu nombre completo.' }, { status: 400 })
  }
  if (telefono.length !== 10) {
    return NextResponse.json(
      { error: 'El WhatsApp debe tener 10 dígitos.' },
      { status: 400 },
    )
  }

  try {
    const sorteo = await getSorteoAbierto(db)
    if (!sorteo) {
      return NextResponse.json(
        { error: 'Ahorita no hay ningún sorteo activo. ¡Vuelve pronto! 🍓' },
        { status: 409 },
      )
    }

    const { error } = await db
      .from('participantes')
      .insert({ sorteo_id: sorteo.id, nombre, telefono })

    if (error) {
      // 23505 = violación de índice único => ese número ya participó este mes.
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ese número ya está registrado en el sorteo de este mes. ¡Ya estás dentro! 🎉' },
          { status: 409 },
        )
      }
      throw error
    }

    return NextResponse.json({ ok: true, premio: sorteo.premio }, { status: 201 })
  } catch (err) {
    console.error('[participantes] error al registrar:', err)
    return NextResponse.json(
      { error: 'No se pudo guardar tu registro. Intenta de nuevo.' },
      { status: 500 },
    )
  }
}
