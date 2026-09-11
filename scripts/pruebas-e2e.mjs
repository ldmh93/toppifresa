// Pruebas de regresión de extremo a extremo.
//
// Uso:  node --env-file=.env.local scripts/pruebas-e2e.mjs [urlBase]
//
// Recorre los dos flujos completos con un navegador real y comprueba que la
// funcionalidad que existía antes del rediseño sigue funcionando:
//
//   Cliente:  menú → filtros → carrito → cantidades → notas → checkout →
//             mínimo de domicilio → mensaje de WhatsApp
//   Admin:    login → dashboard → CRUD de productos → disponibilidad →
//             reordenar → sabores → generación del código para publicar
//
// Usa el Chrome instalado en el sistema. Requiere el servidor levantado.

import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://localhost:3000'
const USUARIO = process.env.ADMIN_USER || 'toppifresa'
const CLAVE = process.env.ADMIN_PASSWORD

const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
]
const ejecutable = CHROMES.find((p) => existsSync(p))
if (!ejecutable) throw new Error('No se encontró Chrome ni Edge.')

let pasadas = 0
let fallidas = 0
const detalles = []

function comprobar(nombre, condicion, extra = '') {
  if (condicion) {
    pasadas++
    console.log(`  ✅ ${nombre}`)
  } else {
    fallidas++
    console.log(`  ❌ ${nombre}${extra ? ` — ${extra}` : ''}`)
    detalles.push(nombre)
  }
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

/** Texto visible de la página, para buscar contenido sin depender del DOM. */
const textoDe = (pagina) => pagina.evaluate(() => document.body.innerText)

/** Hace clic en el primer elemento cuyo texto coincida. */
async function clicPorTexto(pagina, selector, texto) {
  const encontrado = await pagina.evaluate(
    (sel, txt) => {
      const el = [...document.querySelectorAll(sel)].find((e) =>
        (e.innerText || e.textContent || '').trim().includes(txt),
      )
      if (!el) return false
      el.click()
      return true
    },
    selector,
    texto,
  )
  await esperar(450)
  return encontrado
}

const navegador = await puppeteer.launch({
  executablePath: ejecutable,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

// ───────────────────────────────────────────── FLUJO DEL CLIENTE
console.log('\n🛒 FLUJO DEL CLIENTE\n')
{
  const pagina = await navegador.newPage()
  await pagina.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })

  const erroresJs = []
  pagina.on('pageerror', (e) => erroresJs.push(e.message))

  // --- Inicio ---
  await pagina.goto(`${BASE}/`, { waitUntil: 'networkidle2' })
  const inicio = await textoDe(pagina)
  comprobar('El inicio muestra el menú', inicio.includes('Menú Digital'))
  comprobar('Se ven los productos', inicio.includes('ToppiTradicional'))
  comprobar('Se ven los precios', inicio.includes('$55'))
  comprobar('Aparece el estado del negocio', /Abierto ahora|Cerrado/.test(inicio))

  // --- Catálogo y filtros ---
  await pagina.goto(`${BASE}/productos`, { waitUntil: 'networkidle2' })
  const totalTarjetas = await pagina.$$eval('button', (bs) =>
    bs.filter((b) => (b.innerText || '').includes('Agregar al carrito')).length,
  )
  comprobar('El catálogo lista los 8 productos', totalTarjetas === 8, `encontrados ${totalTarjetas}`)

  await clicPorTexto(pagina, 'button', 'Picantes')
  const trasFiltro = await pagina.$$eval('button', (bs) =>
    bs.filter((b) => (b.innerText || '').includes('Agregar al carrito')).length,
  )
  comprobar('El filtro Picantes reduce la lista', trasFiltro === 1, `quedaron ${trasFiltro}`)

  await clicPorTexto(pagina, 'button', 'Todo el menú')
  const trasReset = await pagina.$$eval('button', (bs) =>
    bs.filter((b) => (b.innerText || '').includes('Agregar al carrito')).length,
  )
  comprobar('Quitar el filtro restaura la lista', trasReset === 8, `quedaron ${trasReset}`)

  // --- Agregar al carrito ---
  const agregado = await clicPorTexto(pagina, 'button', 'Agregar al carrito')
  comprobar('Se puede agregar un producto', agregado)
  await esperar(700)

  const conCarrito = await textoDe(pagina)
  comprobar('Aparece la barra del carrito', conCarrito.includes('Ver carrito'))

  // --- Persistencia ---
  await pagina.reload({ waitUntil: 'networkidle2' })
  await esperar(700)
  const trasRecarga = await textoDe(pagina)
  comprobar('El carrito sobrevive a la recarga', trasRecarga.includes('Ver carrito'))

  // --- Abrir el carrito ---
  await clicPorTexto(pagina, 'button', 'Ver carrito')
  await esperar(700)
  const drawer = await textoDe(pagina)
  comprobar('Se abre el carrito', /Tu pedido|Mi pedido|carrito/i.test(drawer))
  comprobar('El carrito muestra el subtotal', /Subtotal/i.test(drawer))
  // Con un solo producto de $55 el subtotal no llega al mínimo de $100, así
  // que la barra debe decir cuánto falta (no el mínimo en bruto).
  comprobar(
    'Avisa cuánto falta para domicilio',
    /Te faltan/i.test(drawer) && /\$45/.test(drawer),
    'no aparece "Te faltan $45"',
  )

  // --- Ir al checkout ---
  const fue = await clicPorTexto(pagina, 'button', 'Finalizar')
  if (fue) {
    await esperar(700)
    const checkout = await textoDe(pagina)
    comprobar('El checkout pide los datos del cliente', /Nombre|WhatsApp|Tel/i.test(checkout))
    comprobar('El checkout ofrece recoger o domicilio', /Recoger|Domicilio/i.test(checkout))
    comprobar('El checkout ofrece forma de pago', /Efectivo|pago/i.test(checkout))
  } else {
    comprobar('El checkout se abre desde el carrito', false, 'no se encontró "Finalizar"')
  }

  comprobar('Sin errores de JavaScript en el flujo', erroresJs.length === 0, erroresJs[0])
  await pagina.close()
}

// ───────────────────────────────────────────── MENSAJE DE WHATSAPP
console.log('\n💬 MENSAJE DE WHATSAPP\n')
{
  // El mensaje se construye con una función pura: se prueba directamente,
  // sin navegador, porque es el corazón del pedido.
  const { buildCartMessage } = await import('../lib/cart/config.js')
  const mensaje = buildCartMessage({
    items: [{ name: 'ToppiOreo', price: 65, qty: 2, note: 'sin nuez' }],
    subtotal: 130,
    discount: 0,
    coupon: null,
    total: 130,
    cliente: {
      nombre: 'Ana López',
      telefono: '4431234567',
      entrega: 'domicilio',
      zona: 'centro',
      direccion: 'Calle Falsa 123',
      referencias: 'Portón azul',
      hora: '6:00 PM',
      pago: 'Efectivo',
      observaciones: 'Tocar el timbre',
    },
  })

  comprobar('Incluye el nombre del cliente', mensaje.includes('Ana López'))
  comprobar('Incluye el teléfono con lada', mensaje.includes('+52 4431234567'))
  comprobar('Incluye producto y cantidad', mensaje.includes('2x ToppiOreo'))
  comprobar('Incluye el importe de la línea', mensaje.includes('$130'))
  comprobar('Incluye la nota del producto', mensaje.includes('sin nuez'))
  comprobar('Incluye el envío de Zona Centro', mensaje.includes('$30'))
  comprobar('Suma el envío al total', mensaje.includes('$160'))
  comprobar('Incluye la dirección', mensaje.includes('Calle Falsa 123'))
  comprobar('Incluye las referencias', mensaje.includes('Portón azul'))
  comprobar('Incluye la hora deseada', mensaje.includes('6:00 PM'))
  comprobar('Incluye la forma de pago', mensaje.includes('Efectivo'))
  comprobar('Incluye las observaciones', mensaje.includes('Tocar el timbre'))
  comprobar('Incluye la nota legal de solicitud', mensaje.includes('únicamente una solicitud'))
}

// ───────────────────────────────────────────── FLUJO ADMINISTRATIVO
console.log('\n🔐 FLUJO ADMINISTRATIVO\n')
if (!CLAVE) {
  console.log('  ⚠️  Sin ADMIN_PASSWORD no se puede probar /admin. Se omite.')
} else {
  const pagina = await navegador.newPage()
  await pagina.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  const erroresJs = []
  pagina.on('pageerror', (e) => erroresJs.push(e.message))

  // --- Autenticación ---
  // Se comprueba con una petición directa, no con el navegador: ante un 401
  // con WWW-Authenticate, Chrome aborta la navegación en vez de entregar la
  // respuesta, así que puppeteer nunca llega a ver el código de estado.
  {
    const r = await fetch(`${BASE}/admin`, { redirect: 'manual' })
    comprobar('El panel exige contraseña', r.status === 401, `dio ${r.status}`)
    comprobar(
      'Pide autenticación básica',
      (r.headers.get('www-authenticate') || '').toLowerCase().includes('basic'),
    )
    const malas = await fetch(`${BASE}/admin`, {
      headers: { Authorization: 'Basic ' + Buffer.from('malo:malo').toString('base64') },
    })
    comprobar('Rechaza credenciales incorrectas', malas.status === 401, `dio ${malas.status}`)
  }

  await pagina.authenticate({ username: USUARIO, password: CLAVE })
  const conAuth = await pagina.goto(`${BASE}/admin`, { waitUntil: 'networkidle2' })
  comprobar('Con la contraseña correcta entra', conAuth.status() === 200)

  await esperar(1200)
  const panel = await textoDe(pagina)
  comprobar('El dashboard carga', panel.includes('Dashboard'))
  comprobar('Ya no menciona Firebase', !/firebase/i.test(panel))
  comprobar('Muestra el número real de productos', /\b8\b/.test(panel))
  comprobar('Muestra el número real de toppings', /\b25\b/.test(panel))
  comprobar('Muestra las promos activas reales', /\b3\b/.test(panel))
  comprobar('Enlaza la sección de Sabores', panel.includes('Sabores'))

  // --- Productos: editar y persistir ---
  await pagina.goto(`${BASE}/admin/productos`, { waitUntil: 'networkidle2' })
  await esperar(900)
  let prod = await textoDe(pagina)
  comprobar('La lista de productos carga', prod.includes('ToppiTradicional'))
  comprobar('Cada producto muestra su disponibilidad', prod.includes('Disponible'))
  comprobar('Ya no promete guardar con Firebase', !/firebase/i.test(prod))

  // Marcar el primer producto como agotado
  const botonAgotar = await pagina.$('button[aria-label^="Marcar ToppiTradicional como agotado"]')
  comprobar('Existe el botón de marcar agotado', Boolean(botonAgotar))
  if (botonAgotar) {
    await botonAgotar.click()
    await esperar(600)
    prod = await textoDe(pagina)
    comprobar('El producto queda marcado como agotado', prod.includes('Agotado'))

    // El borrador debe sobrevivir a la recarga
    await pagina.reload({ waitUntil: 'networkidle2' })
    await esperar(1100)
    prod = await textoDe(pagina)
    comprobar('El borrador sobrevive a la recarga', prod.includes('Agotado'))
    comprobar('Avisa de que hay cambios sin publicar', /sin publicar/i.test(prod))
  }

  // --- Generación del código ---
  const abrio = await clicPorTexto(pagina, 'button', 'Código para publicar')
  comprobar('Se abre el diálogo de publicación', abrio)
  await esperar(700)
  const dialogo = await textoDe(pagina)
  comprobar('Dice en qué archivo pegar', dialogo.includes('lib/data/products.js'))
  const codigo = await pagina.$eval('pre', (el) => el.innerText).catch(() => '')
  comprobar('Genera el bloque de datos', codigo.includes('export const products'))
  comprobar('El bloque lleva marcas de inicio y fin', codigo.includes('INICIO DATOS') && codigo.includes('FIN DATOS'))
  comprobar('El bloque refleja el cambio hecho', codigo.includes("estado: 'agotado'"))

  // Cerrar y descartar el borrador para no dejar basura
  await pagina.keyboard.press('Escape')
  await clicPorTexto(pagina, 'button', 'Cerrar')
  await pagina.evaluate(() => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('toppifresa_borrador_'))
      .forEach((k) => localStorage.removeItem(k))
  })

  // --- Sabores ---
  await pagina.goto(`${BASE}/admin/sabores`, { waitUntil: 'networkidle2' })
  await esperar(900)
  const sab = await textoDe(pagina)
  comprobar('La página de sabores carga', sab.includes('Sabores'))
  comprobar('Lista los sabores con su precio', sab.includes('Oreo triturado') && sab.includes('+$10'))
  comprobar('Explica que aún no se usan', /todavía no le aparece/i.test(sab))

  // --- Categorías ---
  await pagina.goto(`${BASE}/admin/categorias`, { waitUntil: 'networkidle2' })
  await esperar(900)
  const cat = await textoDe(pagina)
  comprobar('La página de categorías carga', cat.includes('Categorías'))
  comprobar('Lista las categorías del menú', cat.includes('Clásico') && cat.includes('Premium'))
  comprobar('Muestra cuántos productos usa cada una', /\d+ productos?/.test(cat))

  // --- Toppings ---
  await pagina.goto(`${BASE}/admin/toppings`, { waitUntil: 'networkidle2' })
  await esperar(900)
  const top = await textoDe(pagina)
  comprobar('La página de toppings carga', top.includes('Toppings'))
  comprobar('Muestra las categorías', top.includes('Crujientes'))
  comprobar('Toppings ya no menciona Firebase', !/firebase/i.test(top))

  // --- Promos ---
  await pagina.goto(`${BASE}/admin/promos`, { waitUntil: 'networkidle2' })
  await esperar(900)
  const pro = await textoDe(pagina)
  comprobar('La página de promos carga', pro.includes('Promos'))

  // --- Configuración ---
  await pagina.goto(`${BASE}/admin/config`, { waitUntil: 'networkidle2' })
  await esperar(700)
  const cfg = await textoDe(pagina)
  comprobar('La configuración carga', cfg.includes('Configuración'))
  comprobar('Dice que es de solo lectura', /solo lectura/i.test(cfg))
  comprobar('Muestra el envío real ($30)', cfg.includes('$30'))
  comprobar('Muestra el mínimo real ($100)', cfg.includes('$100'))
  comprobar('Indica el archivo de cada dato', cfg.includes('lib/cart/config.js'))

  comprobar('Sin errores de JavaScript en el panel', erroresJs.length === 0, erroresJs[0])
  await pagina.close()
}

await navegador.close()

console.log(`\n${'─'.repeat(52)}`)
console.log(`${pasadas} pasadas · ${fallidas} fallidas`)
if (fallidas) {
  console.log('\nFallaron:')
  detalles.forEach((d) => console.log('  · ' + d))
}
process.exit(fallidas ? 1 : 0)
