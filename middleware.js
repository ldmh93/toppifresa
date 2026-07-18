import { NextResponse } from 'next/server'

// Protege todo /admin con autenticación básica (HTTP Basic Auth).
// La contraseña NUNCA va en el código: se lee de variables de entorno.
export const config = {
  matcher: ['/admin', '/admin/:path*'],
}

export function middleware(req) {
  const USER = process.env.ADMIN_USER || 'toppifresa'
  const PASS = process.env.ADMIN_PASSWORD

  // Sin contraseña configurada => panel bloqueado (seguro por defecto).
  if (!PASS) {
    return new NextResponse(
      'Panel deshabilitado. Configura la variable de entorno ADMIN_PASSWORD para habilitar /admin.',
      { status: 503 },
    )
  }

  const auth = req.headers.get('authorization')
  if (auth?.startsWith('Basic ')) {
    const decoded = atob(auth.slice(6))
    const i = decoded.indexOf(':')
    const user = decoded.slice(0, i)
    const pass = decoded.slice(i + 1)
    if (user === USER && pass === PASS) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Autenticación requerida.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Toppifresa Admin", charset="UTF-8"' },
  })
}
