'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react'
import { categorias as publicadas } from '@/lib/data/categorias'
import { products } from '@/lib/data/products'
import { useBorrador } from '@/lib/admin/borrador'
import BarraPublicar from '@/components/admin/BarraPublicar'

function CategoriaForm({ initial, idsExistentes, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { id: '', emoji: '🏷️', activo: true })
  const esNuevo = !initial
  const nombre = form.id.trim()
  const repetido = nombre && nombre !== initial?.id && idsExistentes.includes(nombre)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Renombrar una categoría deja huérfanos a los productos que la usaban.
  const afectados = !esNuevo && nombre !== initial.id
    ? products.filter((p) => p.tag === initial.id).length
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="mb-4 overflow-hidden rounded-2xl border border-app-border bg-white shadow-card-hover"
    >
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <p className="text-sm font-bold text-app-text">
          {initial ? `Editar ${initial.id}` : 'Nueva categoría'}
        </p>
        <button
          onClick={onCancel}
          aria-label="Cerrar formulario"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-gray-500">Emoji</label>
            <input
              value={form.emoji}
              onChange={(e) => set('emoji', e.target.value)}
              maxLength={4}
              className="w-16 rounded-xl border border-gray-200 py-2 text-center text-2xl outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-bold text-gray-500">Nombre</label>
            <input
              value={form.id}
              onChange={(e) => set('id', e.target.value)}
              placeholder="Premium"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {repetido && (
          <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            Ya existe una categoría con ese nombre.
          </p>
        )}

        {afectados > 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
            <AlertTriangle size={15} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-800">
              <strong className="font-bold">{afectados} producto(s)</strong> usan «{initial.id}». Al
              guardar se les cambiará la categoría a «{nombre}» automáticamente, pero recuerda
              publicar también <code className="font-mono">products.js</code>.
            </p>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-bold text-gray-500">Visible en los filtros</label>
          <button
            onClick={() => set('activo', !form.activo)}
            aria-pressed={form.activo}
            className={`rounded-xl border-2 px-4 py-2.5 text-sm font-bold ${
              form.activo
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 bg-gray-50 text-gray-400'
            }`}
          >
            {form.activo ? 'Sí' : 'No'}
          </button>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave({ ...form, id: nombre }, initial?.id)}
            disabled={!nombre || repetido}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            <Check size={16} /> Guardar
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminCategorias() {
  const [items, setItems, { hidratado, hayBorrador, descartar }] = useBorrador(
    'categorias',
    publicadas,
  )
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const renumerar = (lista) => lista.map((c, i) => ({ ...c, orden: i + 1 }))
  const usoDe = (id) => products.filter((p) => p.tag === id).length

  const guardar = (form, idAnterior) => {
    if (editing) {
      setItems(renumerar(items.map((c) => (c.id === idAnterior ? form : c))))
      setEditing(null)
    } else {
      setItems(renumerar([...items, form]))
      setCreating(false)
    }
  }

  const eliminar = (id) => {
    const uso = usoDe(id)
    const aviso = uso
      ? `\n\n⚠️ ${uso} producto(s) están en esta categoría y se quedarían sin una válida. Cámbiales la categoría antes de borrarla.`
      : ''
    if (confirm(`¿Eliminar la categoría "${id}"?${aviso}`)) {
      setItems(renumerar(items.filter((c) => c.id !== id)))
    }
  }

  const mover = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const copia = [...items]
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
    setItems(renumerar(copia))
  }

  if (!hidratado) return <div className="h-40 animate-pulse rounded-2xl bg-white/60" />

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-black text-app-text">Categorías 🏷️</h1>
          <p className="text-xs text-app-muted">
            {items.filter((c) => c.activo).length} visibles de {items.length}
          </p>
        </div>
        <button
          onClick={() => {
            setCreating(true)
            setEditing(null)
          }}
          className="tap-scale flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-fab"
        >
          <Plus size={18} /> Nueva
        </button>
      </div>

      <AnimatePresence>
        {creating && (
          <CategoriaForm
            idsExistentes={items.map((c) => c.id)}
            onSave={guardar}
            onCancel={() => setCreating(false)}
          />
        )}
        {editing && (
          <CategoriaForm
            initial={editing}
            idsExistentes={items.map((c) => c.id)}
            onSave={guardar}
            onCancel={() => setEditing(null)}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {items.map((c, i) => {
            const uso = usoDe(c.id)
            return (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`flex items-center gap-2 rounded-2xl bg-white p-3 shadow-card ${
                  c.activo ? '' : 'opacity-60'
                }`}
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => mover(i, -1)}
                    disabled={i === 0}
                    aria-label={`Subir ${c.id}`}
                    className="flex h-5 w-6 items-center justify-center text-gray-400 disabled:opacity-25"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => mover(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label={`Bajar ${c.id}`}
                    className="flex h-5 w-6 items-center justify-center text-gray-400 disabled:opacity-25"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                <span className="w-8 text-center text-xl">{c.emoji}</span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-app-text">{c.id}</p>
                  <p className="text-xs text-app-muted">
                    {uso} producto{uso === 1 ? '' : 's'}
                    {!c.activo && ' · oculta'}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setItems(items.map((x) => (x.id === c.id ? { ...x, activo: !x.activo } : x)))
                  }
                  aria-label={c.activo ? `Ocultar ${c.id}` : `Mostrar ${c.id}`}
                  aria-pressed={c.activo}
                  className={`flex-shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${
                    c.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {c.activo ? 'Visible' : 'Oculta'}
                </button>
                <button
                  onClick={() => setEditing(c)}
                  aria-label={`Editar ${c.id}`}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50"
                >
                  <Pencil size={13} className="text-blue-500" />
                </button>
                <button
                  onClick={() => eliminar(c.id)}
                  aria-label={`Eliminar ${c.id}`}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-red-50"
                >
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <BarraPublicar
        nombreExport="categorias"
        datos={items}
        hayBorrador={hayBorrador}
        onDescartar={descartar}
      />
    </div>
  )
}
