'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Download, FileCode2, RotateCcw, X } from 'lucide-react'
import { copiar, descargar, generarBloque, DESTINOS } from '@/lib/admin/exportar'

/**
 * Barra de publicación del panel.
 *
 * El catálogo de Toppifresa vive en archivos de código, no en una base de
 * datos. Este componente es honesto al respecto: dice dónde se guardó lo que
 * editaste y te entrega el bloque exacto que hay que pegar para que el cambio
 * llegue a los clientes.
 */
export default function BarraPublicar({ nombreExport, datos, hayBorrador, onDescartar }) {
  const [abierto, setAbierto] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const archivo = DESTINOS[nombreExport] ?? 'lib/data/…'
  const bloque = generarBloque(nombreExport, datos)

  const handleCopiar = async () => {
    const ok = await copiar(bloque)
    setCopiado(ok)
    setTimeout(() => setCopiado(false), 2500)
  }

  return (
    <>
      <div className="sticky bottom-4 z-30 mt-6">
        <div className="rounded-2xl border border-primary-200 bg-white p-3 shadow-card-hover">
          {hayBorrador ? (
            <p className="mb-2.5 text-xs leading-relaxed text-app-muted">
              <strong className="font-bold text-primary">Borrador sin publicar.</strong> Lo que
              editaste está guardado solo en este navegador. Para que lo vean tus clientes hay que
              pegarlo en <code className="rounded bg-primary-50 px-1 font-mono">{archivo}</code> y
              publicar.
            </p>
          ) : (
            <p className="mb-2.5 text-xs leading-relaxed text-app-muted">
              Estás viendo lo que hay publicado hoy. Edita y luego genera el código.
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setAbierto(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
            >
              <FileCode2 size={16} />
              Código para publicar
            </button>
            {hayBorrador && (
              <button
                onClick={() => {
                  if (confirm('¿Descartar el borrador y volver a lo publicado?')) onDescartar()
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-app-border px-3 py-2.5 text-sm font-bold text-app-muted"
                aria-label="Descartar borrador y volver a lo publicado"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
            onClick={() => setAbierto(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-app-text">Publicar cambios</p>
                  <p className="text-xs text-app-muted">3 pasos, una sola vez</p>
                </div>
                <button
                  onClick={() => setAbierto(false)}
                  aria-label="Cerrar"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="border-b border-gray-100 bg-primary-50 px-4 py-3">
                <ol className="list-decimal space-y-1 pl-4 text-xs leading-relaxed text-primary-900">
                  <li>
                    Copia el bloque de abajo con el botón <strong>Copiar</strong>.
                  </li>
                  <li>
                    Abre <code className="rounded bg-white px-1 font-mono">{archivo}</code> y
                    reemplaza todo lo que hay entre{' '}
                    <code className="rounded bg-white px-1 font-mono">INICIO DATOS</code> y{' '}
                    <code className="rounded bg-white px-1 font-mono">FIN DATOS</code>.
                  </li>
                  <li>Guarda, haz commit y publica. Vercel actualiza la app sola.</li>
                </ol>
              </div>

              <pre className="flex-1 overflow-auto bg-[#241012] p-4 text-[11px] leading-relaxed text-[#FBE0DF]">
                <code>{bloque}</code>
              </pre>

              <div className="flex gap-2 border-t border-gray-100 p-3">
                <button
                  onClick={handleCopiar}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white"
                >
                  {copiado ? (
                    <>
                      <Check size={16} /> ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copiar
                    </>
                  )}
                </button>
                <button
                  onClick={() => descargar(bloque, `${nombreExport}.js`)}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-app-border px-4 py-3 text-sm font-bold text-app-muted"
                >
                  <Download size={16} /> Descargar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
