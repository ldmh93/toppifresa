// Mide cuánto tarda en fallar una petición a Supabase cuando la base no
// responde, para comprobar que el tiempo límite funciona de verdad.
//
// Uso:  node --env-file=.env.local scripts/diagnostico-supabase.mjs

const URL_BASE = process.env.SUPABASE_URL
const LLAVE = process.env.SUPABASE_SECRET_KEY

if (!URL_BASE || !LLAVE) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SECRET_KEY.')
  process.exit(1)
}

const destino = `${URL_BASE}/rest/v1/sorteos?select=id&limit=1`

async function medir(etiqueta, hacer) {
  const t0 = Date.now()
  try {
    const r = await hacer()
    console.log(`${etiqueta}: HTTP ${r.status} en ${((Date.now() - t0) / 1000).toFixed(1)}s`)
  } catch (e) {
    console.log(`${etiqueta}: ${e.name} — ${e.message} en ${((Date.now() - t0) / 1000).toFixed(1)}s`)
  }
}

const cabeceras = { apikey: LLAVE, Authorization: `Bearer ${LLAVE}` }

await medir('fetch sin límite     ', () => fetch(destino, { headers: cabeceras }))
await medir('AbortSignal.timeout 8s', () =>
  fetch(destino, { headers: cabeceras, signal: AbortSignal.timeout(8000) }),
)
await medir('AbortController 3s   ', () => {
  const c = new AbortController()
  setTimeout(() => c.abort(), 3000)
  return fetch(destino, { headers: cabeceras, signal: c.signal })
})
