// Convierte lo que editas en el panel en código JavaScript listo para pegar
// en los archivos de lib/data/.
//
// Por qué existe: el catálogo vive en archivos de código, no en una base de
// datos. El panel es un editor cómodo, pero para que un cambio llegue a los
// clientes hay que pegarlo en el archivo y publicar. Esto genera ese texto
// sin que tengas que escribir JavaScript a mano.

/** Escapa un texto para meterlo entre comillas simples de JavaScript. */
function texto(s) {
  const escapado = String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n')
  return `'${escapado}'`
}

/** Una clave se escribe sin comillas solo si es un identificador válido. */
function clave(k) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : texto(k)
}

/** ¿Cabe este objeto en una sola línea sin volverse ilegible? */
function esCorto(valor) {
  if (Array.isArray(valor)) return valor.length <= 4 && valor.every((v) => typeof v !== 'object')
  if (valor && typeof valor === 'object') {
    const claves = Object.keys(valor)
    return claves.length <= 4 && claves.every((k) => typeof valor[k] !== 'object')
  }
  return false
}

/** Serializa cualquier valor a JavaScript legible e indentado. */
export function serializar(valor, nivel = 0) {
  const sangria = '  '.repeat(nivel)
  const sangriaHija = '  '.repeat(nivel + 1)

  if (valor === null || valor === undefined) return 'null'
  if (typeof valor === 'number') return Number.isFinite(valor) ? String(valor) : '0'
  if (typeof valor === 'boolean') return String(valor)
  if (typeof valor === 'string') return texto(valor)

  if (Array.isArray(valor)) {
    if (valor.length === 0) return '[]'
    if (esCorto(valor)) return `[${valor.map((v) => serializar(v, 0)).join(', ')}]`
    const items = valor.map((v) => `${sangriaHija}${serializar(v, nivel + 1)}`)
    return `[\n${items.join(',\n')},\n${sangria}]`
  }

  if (typeof valor === 'object') {
    const entradas = Object.entries(valor).filter(([, v]) => v !== undefined)
    if (entradas.length === 0) return '{}'
    if (esCorto(valor)) {
      return `{ ${entradas.map(([k, v]) => `${clave(k)}: ${serializar(v, 0)}`).join(', ')} }`
    }
    const lineas = entradas.map(
      ([k, v]) => `${sangriaHija}${clave(k)}: ${serializar(v, nivel + 1)}`,
    )
    return `{\n${lineas.join(',\n')},\n${sangria}}`
  }

  return 'null'
}

/**
 * Genera el bloque completo que se pega en el archivo de datos, incluidas las
 * marcas de inicio y fin que delimitan la zona reemplazable.
 */
export function generarBloque(nombreExport, datos) {
  return [
    '// ⬇️ INICIO DATOS — generado por /admin, reemplaza hasta FIN DATOS',
    `export const ${nombreExport} = ${serializar(datos, 0)}`,
    '// ⬆️ FIN DATOS',
  ].join('\n')
}

/** Dónde va cada bloque. Se muestra en el panel. */
export const DESTINOS = {
  products: 'lib/data/products.js',
  toppingCategories: 'lib/data/toppings.js',
  promos: 'lib/data/promos.js',
  sabores: 'lib/data/sabores.js',
  categorias: 'lib/data/categorias.js',
}

/** Copia al portapapeles. Devuelve true si lo consiguió. */
export async function copiar(texto_) {
  try {
    await navigator.clipboard.writeText(texto_)
    return true
  } catch {
    // Safari y contextos sin HTTPS bloquean la API del portapapeles.
    try {
      const ta = document.createElement('textarea')
      ta.value = texto_
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

/** Descarga el bloque como archivo .js, por si copiar falla. */
export function descargar(contenido, nombreArchivo) {
  const blob = new Blob([contenido], { type: 'text/javascript;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
