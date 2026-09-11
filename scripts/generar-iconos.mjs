// Genera los iconos PWA a partir del monograma oficial de la marca.
//
// Uso:  node scripts/generar-iconos.mjs
//
// Lee public/brand/logo-mark.svg (el monograma "ToF"), lo recolorea en blanco
// sobre el rojo de marca y exporta todos los tamaños que pide el manifiesto.
// Volver a correrlo es seguro: sobrescribe los PNG existentes.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const ORIGEN = path.join(RAIZ, 'public/brand/logo-mark.svg')
const DESTINO = path.join(RAIZ, 'public/icons')

const ROJO = '#9C0B0A'
const ROJO_OSCURO = '#6B0306'
const CREMA = '#FFF5F5'
const ROSA = '#FEC5CB'

// Tamaños del manifiesto + el apple-touch de 180.
const TAMANOS = [72, 96, 128, 144, 152, 180, 192, 384, 512]

// Los iconos "maskable" se recortan en círculo en Android: el contenido debe
// caber en el 80% central o se le comen las orillas.
const AREA_SEGURA = 0.62

function componerIcono(interiorSvg, vbAncho, vbAlto) {
  // Escala el monograma para que quepa en el área segura, centrado.
  const escala = (512 * AREA_SEGURA) / Math.max(vbAncho, vbAlto)
  const ancho = vbAncho * escala
  const alto = vbAlto * escala
  const x = (512 - ancho) / 2
  const y = (512 - alto) / 2

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${ROJO}"/>
      <stop offset="1" stop-color="${ROJO_OSCURO}"/>
    </linearGradient>
    <style>
      .cls-1 { fill: ${CREMA} !important; }
      .cls-2 { fill: ${ROSA} !important; }
    </style>
  </defs>
  <rect width="512" height="512" fill="url(#fondo)"/>
  <g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${escala.toFixed(5)})">
    ${interiorSvg}
  </g>
</svg>`
}

const svg = await readFile(ORIGEN, 'utf8')

// viewBox del monograma, para escalarlo sin deformarlo.
const vb = svg.match(/viewBox="([\d.\s-]+)"/)
if (!vb) throw new Error(`${ORIGEN} no tiene viewBox`)
const [, , vbAncho, vbAlto] = vb[1].trim().split(/\s+/).map(Number)

// Nos quedamos solo con el contenido dibujable (sin <svg> ni <defs>), porque
// los colores los reemplaza el <style> del icono compuesto.
const interior = svg
  .replace(/^[\s\S]*?<\/defs>/, '')
  .replace(/<\/svg>\s*$/, '')
  .trim()

const fuente = componerIcono(interior, vbAncho, vbAlto)

await mkdir(DESTINO, { recursive: true })
await writeFile(path.join(DESTINO, 'icon-source.svg'), fuente, 'utf8')

const buffer = Buffer.from(fuente)
for (const tam of TAMANOS) {
  const salida = path.join(DESTINO, `icon-${tam}x${tam}.png`)
  await sharp(buffer, { density: 384 })
    .resize(tam, tam, { fit: 'cover' })
    .png({ compressionLevel: 9, palette: true })
    .toFile(salida)
  console.log(`✓ icon-${tam}x${tam}.png`)
}

// Favicon multi-resolución para la pestaña del navegador.
await sharp(buffer, { density: 384 })
  .resize(48, 48, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile(path.join(RAIZ, 'public/favicon.png'))
console.log('✓ favicon.png')

console.log('\nIconos regenerados desde el monograma de marca.')
