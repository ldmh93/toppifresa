// Prueba del generador de código del panel.
//
// Uso:  node scripts/probar-exportacion.mjs
//
// Toma los datos reales del catálogo, genera el bloque que el panel entrega
// para pegar, lo vuelve a importar como módulo y comprueba que el resultado
// sea idéntico al original. Si esto pasa, el código que copias siempre
// compila y no pierde información.

import { writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { generarBloque } from '../lib/admin/exportar.js'
import { products } from '../lib/data/products.js'
import { toppingCategories } from '../lib/data/toppings.js'
import { promos } from '../lib/data/promos.js'
import { sabores } from '../lib/data/sabores.js'
import { categorias } from '../lib/data/categorias.js'

const carpeta = mkdtempSync(path.join(tmpdir(), 'toppi-export-'))

const casos = [
  ['products', products],
  ['toppingCategories', toppingCategories],
  ['promos', promos],
  ['sabores', sabores],
  ['categorias', categorias],
]

let fallos = 0

for (const [nombre, datos] of casos) {
  const bloque = generarBloque(nombre, datos)
  const archivo = path.join(carpeta, `${nombre}.mjs`)
  writeFileSync(archivo, bloque, 'utf8')

  try {
    const mod = await import(pathToFileURL(archivo).href)
    const ida = JSON.stringify(datos)
    const vuelta = JSON.stringify(mod[nombre])
    if (ida === vuelta) {
      console.log(`✅ ${nombre}: compila y conserva los datos (${bloque.length} bytes)`)
    } else {
      console.log(`❌ ${nombre}: compila pero los datos cambiaron`)
      fallos++
    }
  } catch (e) {
    console.log(`❌ ${nombre}: no compila — ${e.message}`)
    fallos++
  }
}

// Casos límite: comillas, acentos, saltos de línea y caracteres raros.
const raros = [
  { id: 'a', name: "Hershey's", nota: 'Comilla simple' },
  { id: 'b', name: 'Salto\nde línea', nota: 'Multilínea' },
  { id: 'c', name: 'Barra \\ invertida', nota: 'Escape' },
  { id: 'd', name: 'Acentos: ñ á é í ó ú ü ¿? ¡!', nota: 'Español' },
  { id: 'e', name: 'Emoji 🍓🌶️', nota: 'Unicode' },
  { id: 'f', name: 'Comillas "dobles"', nota: 'Dobles' },
]
const bloqueRaros = generarBloque('raros', raros)
const archivoRaros = path.join(carpeta, 'raros.mjs')
writeFileSync(archivoRaros, bloqueRaros, 'utf8')
try {
  const mod = await import(pathToFileURL(archivoRaros).href)
  const ok = JSON.stringify(mod.raros) === JSON.stringify(raros)
  console.log(`${ok ? '✅' : '❌'} casos límite (comillas, acentos, emoji, escapes)`)
  if (!ok) fallos++
} catch (e) {
  console.log(`❌ casos límite: no compila — ${e.message}`)
  fallos++
}

console.log(fallos ? `\n${fallos} fallo(s).` : '\nTodo correcto.')
process.exit(fallos ? 1 : 0)
