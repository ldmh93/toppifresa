import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function POST(request) {
  try {
    const body = await request.json()
    const { nombre, telefono } = body

    if (!nombre?.trim() || !telefono?.trim()) {
      return NextResponse.json(
        { message: 'Nombre y teléfono son requeridos.' },
        { status: 400 },
      )
    }

    if (telefono.length < 10) {
      return NextResponse.json(
        { message: 'El teléfono debe tener 10 dígitos.' },
        { status: 400 },
      )
    }

    // Check for duplicate phone
    const existing = await adminDb
      .collection('cupones')
      .where('telefono', '==', telefono.trim())
      .limit(1)
      .get()

    if (!existing.empty) {
      return NextResponse.json(
        { message: 'Este número ya está registrado en la dinámica.' },
        { status: 409 },
      )
    }

    const docRef = await adminDb.collection('cupones').add({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      createdAt: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    })

    return NextResponse.json(
      { success: true, id: docRef.id },
      { status: 201 },
    )
  } catch (error) {
    console.error('[POST /api/cupones]', error)
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 },
    )
  }
}

export async function GET(request) {
  // Simple admin key check — replace with proper auth in production
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ message: 'No autorizado.' }, { status: 401 })
  }

  try {
    const snapshot = await adminDb
      .collection('cupones')
      .orderBy('createdAt', 'desc')
      .get()

    const cupones = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ cupones })
  } catch (error) {
    console.error('[GET /api/cupones]', error)
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 },
    )
  }
}
