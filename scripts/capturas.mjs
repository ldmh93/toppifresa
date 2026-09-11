// Capturas de pantalla de la app en todas las resoluciones objetivo.
//
// Uso:  node scripts/capturas.mjs [urlBase] [carpetaSalida]
//       (por defecto http://localhost:3000 y ./capturas)
//
// Usa el Chrome que ya está instalado en el sistema: no descarga navegadores.
// Requiere que el servidor esté corriendo (npm run dev  o  npm start).

import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://localhost:3000'
const SALIDA = path.resolve(process.argv[3] || 'capturas')

const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
]
const ejecutable = CHROMES.find((p) => existsSync(p))
if (!ejecutable) throw new Error('No se encontró Chrome ni Edge instalado.')

// Las resoluciones que pide la especificación.
const PANTALLAS = [
  { nombre: 'movil-360', width: 360, height: 800, movil: true },
  { nombre: 'movil-375', width: 375, height: 812, movil: true },
  { nombre: 'movil-390', width: 390, height: 844, movil: true },
  { nombre: 'movil-414', width: 414, height: 896, movil: true },
  { nombre: 'tablet-768', width: 768, height: 1024, movil: true },
  { nombre: 'tablet-820', width: 820, height: 1180, movil: true },
  { nombre: 'desktop-1280', width: 1280, height: 720, movil: false },
  { nombre: 'desktop-1440', width: 1440, height: 900, movil: false },
  { nombre: 'desktop-1920', width: 1920, height: 1080, movil: false },
]

const RUTAS = [
  { ruta: '/', nombre: 'inicio' },
  { ruta: '/productos', nombre: 'productos' },
  { ruta: '/promos', nombre: 'promos' },
  { ruta: '/toppings', nombre: 'toppings' },
  { ruta: '/dinamicas', nombre: 'dinamicas' },
  { ruta: '/ubicacion', nombre: 'ubicacion' },
]

// El panel solo se captura si hay credenciales (va detrás de Basic Auth).
const RUTAS_ADMIN = [
  { ruta: '/admin', nombre: 'admin-dashboard' },
  { ruta: '/admin/productos', nombre: 'admin-productos' },
  { ruta: '/admin/sabores', nombre: 'admin-sabores' },
  { ruta: '/admin/toppings', nombre: 'admin-toppings' },
  { ruta: '/admin/config', nombre: 'admin-config' },
]
const ADMIN_USER = process.env.ADMIN_USER || 'toppifresa'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Solo estas combinaciones, para no generar 54 imágenes.
const soloEstas = process.env.CAPTURAS_TODAS
  ? null
  : new Set(['movil-390', 'tablet-768', 'desktop-1440'])

await mkdir(SALIDA, { recursive: true })

const navegador = await puppeteer.launch({
  executablePath: ejecutable,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
})

const errores = []

for (const pantalla of PANTALLAS) {
  if (soloEstas && !soloEstas.has(pantalla.nombre)) continue

  const rutas = ADMIN_PASSWORD ? [...RUTAS, ...RUTAS_ADMIN] : RUTAS

  for (const { ruta, nombre } of rutas) {
    const pagina = await navegador.newPage()
    if (ruta.startsWith('/admin')) {
      await pagina.authenticate({ username: ADMIN_USER, password: ADMIN_PASSWORD })
    }
    await pagina.setViewport({
      width: pantalla.width,
      height: pantalla.height,
      isMobile: pantalla.movil,
      hasTouch: pantalla.movil,
      deviceScaleFactor: 1,
    })

    // Recoge errores de consola y de red: la captura también sirve de prueba.
    pagina.on('console', (m) => {
      if (m.type() === 'error') errores.push(`[consola] ${pantalla.nombre}${ruta}: ${m.text()}`)
    })
    pagina.on('pageerror', (e) => errores.push(`[runtime] ${pantalla.nombre}${ruta}: ${e.message}`))
    pagina.on('requestfailed', (r) => {
      const err = r.failure()?.errorText || ''
      // Los deeplinks de WhatsApp y los recursos externos no se cuentan.
      if (!r.url().startsWith(BASE)) return
      errores.push(`[red] ${pantalla.nombre}${ruta}: ${r.url()} — ${err}`)
    })

    await pagina.goto(`${BASE}${ruta}`, { waitUntil: 'networkidle2', timeout: 60000 })
    // Deja que terminen las animaciones de entrada.
    await new Promise((r) => setTimeout(r, 900))

    // Detecta scroll horizontal, que en móvil es un defecto real.
    const desborde = await pagina.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    if (desborde > 1) {
      errores.push(`[layout] ${pantalla.nombre}${ruta}: desborde horizontal de ${desborde}px`)
    }

    const archivo = path.join(SALIDA, `${pantalla.nombre}--${nombre}.png`)
    await pagina.screenshot({ path: archivo, fullPage: false })
    console.log(`✓ ${path.basename(archivo)}${desborde > 1 ? `  ⚠️ desborde ${desborde}px` : ''}`)
    await pagina.close()
  }
}

await navegador.close()

if (errores.length) {
  console.log(`\n⚠️  ${errores.length} incidencia(s):`)
  for (const e of [...new Set(errores)]) console.log('   ' + e)
  process.exitCode = 1
} else {
  console.log('\n✅ Sin errores de consola, de red ni desbordes horizontales.')
}
