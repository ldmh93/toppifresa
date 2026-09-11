// Revisión de accesibilidad sin dependencias externas.
//
// Uso:  node scripts/revisar-accesibilidad.mjs [urlBase]
//
// Comprueba los fallos que más afectan a quien usa lector de pantalla o
// navega con teclado, y que además son fáciles de introducir sin darse cuenta:
// controles sin nombre, imágenes sin alt, saltos en la jerarquía de títulos,
// campos sin etiqueta y áreas táctiles demasiado pequeñas.

import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://localhost:3000'
const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
]
const ejecutable = CHROMES.find((p) => existsSync(p))
if (!ejecutable) throw new Error('No se encontró Chrome ni Edge.')

const RUTAS = ['/', '/productos', '/promos', '/toppings', '/dinamicas', '/ubicacion']

const navegador = await puppeteer.launch({
  executablePath: ejecutable,
  headless: 'new',
  args: ['--no-sandbox'],
})

let problemas = 0

for (const ruta of RUTAS) {
  const pagina = await navegador.newPage()
  await pagina.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await pagina.goto(`${BASE}${ruta}`, { waitUntil: 'networkidle2' })
  await new Promise((r) => setTimeout(r, 700))

  const hallazgos = await pagina.evaluate(() => {
    const salida = []
    const visible = (el) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
    }
    const nombre = (el) =>
      (
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
        el.innerText ||
        el.textContent ||
        ''
      ).trim()

    // 1. Controles sin nombre accesible
    for (const el of document.querySelectorAll('button, a[href]')) {
      if (!visible(el)) continue
      if (!nombre(el) && !el.querySelector('img[alt]:not([alt=""])')) {
        salida.push(`control sin nombre: <${el.tagName.toLowerCase()}> ${el.className}`.slice(0, 120))
      }
    }

    // 2. Imágenes sin alt
    for (const img of document.querySelectorAll('img')) {
      if (!visible(img)) continue
      if (img.getAttribute('alt') === null) salida.push(`imagen sin alt: ${img.src.slice(-60)}`)
    }

    // 3. Un solo h1 y jerarquía sin saltos
    const titulos = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible)
    const h1s = titulos.filter((t) => t.tagName === 'H1')
    if (h1s.length === 0) salida.push('no hay <h1>')
    if (h1s.length > 1) salida.push(`hay ${h1s.length} <h1> (debe haber uno)`)
    let previo = 0
    for (const t of titulos) {
      const n = Number(t.tagName[1])
      if (previo && n > previo + 1) {
        salida.push(`salto de h${previo} a h${n}: "${(t.innerText || '').slice(0, 40)}"`)
      }
      previo = n
    }

    // 4. Campos de formulario sin etiqueta
    for (const c of document.querySelectorAll('input, select, textarea')) {
      if (!visible(c) || c.type === 'hidden') continue
      const tieneEtiqueta =
        c.getAttribute('aria-label') ||
        c.getAttribute('placeholder') ||
        (c.id && document.querySelector(`label[for="${c.id}"]`)) ||
        c.closest('label')
      if (!tieneEtiqueta) salida.push(`campo sin etiqueta: ${c.tagName.toLowerCase()}.${c.className}`.slice(0, 110))
    }

    // 5. Áreas táctiles pequeñas (mínimo razonable en móvil: 32 px).
    //    El enlace "Saltar al contenido" se excluye: está reducido a 1 px a
    //    propósito y solo se despliega al recibir foco con el teclado.
    for (const el of document.querySelectorAll('button, a[href]')) {
      if (!visible(el)) continue
      if (el.classList.contains('sr-only-focusable')) continue
      const r = el.getBoundingClientRect()
      if (r.width < 32 || r.height < 32) {
        salida.push(
          `área táctil ${Math.round(r.width)}×${Math.round(r.height)}px: "${nombre(el).slice(0, 30)}"`,
        )
      }
    }

    // 6. El idioma debe estar declarado
    if (!document.documentElement.lang) salida.push('falta el atributo lang en <html>')

    return salida
  })

  const unicos = [...new Set(hallazgos)]
  if (unicos.length) {
    console.log(`\n⚠️  ${ruta}`)
    unicos.forEach((h) => console.log(`   · ${h}`))
    problemas += unicos.length
  } else {
    console.log(`✅ ${ruta}`)
  }
  await pagina.close()
}

await navegador.close()
console.log(problemas ? `\n${problemas} punto(s) a revisar.` : '\n✅ Sin problemas de accesibilidad detectados.')
process.exit(problemas ? 1 : 0)
