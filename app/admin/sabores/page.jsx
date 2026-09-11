'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, ChevronUp, ChevronDown, Info } from 'lucide-react'
import { sabores as publicados } from '@/lib/data/sabores'
import { products } from '@/lib/data/products'
import { useBorrador } from '@/lib/admin/borrador'
import BarraPublicar from '@/components/admin/BarraPublicar'

const VACIO = { nombre: '', emoji: '🍨', precioExtra: 0, activo: true }

function generarId(nombre) {
  const base = String(nombre)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return base || `sabor-${Date.now()}`
}

function SaborForm({ initial, idsExistentes, onSave, onCancel }) {
  const [form, setForm] = useState(initial || VACIO)
  const esNuevo = !initial
  const id = esNuevo ? generarId(form.nombre) : initial.id
  const repetido = esNuevo && id && idsExistentes.includes(id)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="mb-4 overflow-hidden rounded-2xl border border-app-border bg-white shadow-card-hover"
    >
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <p className="text-sm font-bold text-app-text">
          {initial ? `Editar ${initial.nombre}` : 'Nuevo sabor'}
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
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder="Crema de avellana"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <p
          className={`rounded-xl border px-3 py-2 font-mono text-xs ${
            repetido
              ? 'border-red-300 bg-red-50 text-red-700'
              : 'border-gray-200 bg-gray-50 text-gray-500'
          }`}
        >
          {id || '—'}
          {repetido && ' · ya existe'}
        </p>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-bold text-gray-500">Precio adicional</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={form.precioExtra}
                onChange={(e) => set('precioExtra', Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-7 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-gray-500">Activo</label>
            <button
              onClick={() => set('activo', !form.activo)}
              aria-pressed={form.activo}
              className={`h-[42px] rounded-xl border-2 px-4 text-sm font-bold ${
                form.activo
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-gray-50 text-gray-400'
              }`}
            >
              {form.activo ? 'Sí' : 'No'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave({ ...form, id, precioExtra: Number(form.precioExtra) })}
            disabled={!form.nombre.trim() || repetido}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            <Check size={16} /> Guardar
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminSabores() {
  const [items, setItems, { hidratado, hayBorrador, descartar }] = useBorrador(
    'sabores',
    publicados,
  )
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const renumerar = (lista) => lista.map((s, i) => ({ ...s, orden: i + 1 }))

  // Cuántos productos ofrecen cada sabor: avisa antes de borrar algo en uso.
  const usoPorSabor = (id) => products.filter((p) => (p.sabores ?? []).includes(id)).length

  const guardar = (form) => {
    if (editing) {
      setItems(renumerar(items.map((s) => (s.id === editing.id ? { ...s, ...form } : s))))
      setEditing(null)
    } else {
      setItems(renumerar([...items, form]))
      setCreating(false)
    }
  }

  const eliminar = (id) => {
    const s = items.find((x) => x.id === id)
    const uso = usoPorSabor(id)
    const aviso = uso
      ? `\n\n⚠️ ${uso} producto(s) lo ofrecen. Quítalo de ellos primero o quedará una referencia rota.`
      : ''
    if (confirm(`¿Eliminar el sabor "${s?.nombre}"?${aviso}`)) {
      setItems(renumerar(items.filter((x) => x.id !== id)))
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
          <h1 className="font-display text-xl font-black text-app-text">Sabores 🍨</h1>
          <p className="text-xs text-app-muted">
            {items.filter((s) => s.activo).length} activos de {items.length}
          </p>
        </div>
        <button
          onClick={() => {
            setCreating(true)
            setEditing(null)
          }}
          className="tap-scale flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-fab"
        >
          <Plus size={18} /> Nuevo
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3">
        <div className="flex items-start gap-2">
          <Info size={15} className="mt-0.5 flex-shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-primary-800">
            Hoy cada sabor se vende como un producto propio (ToppiOreo, ToppiAvellana…), así que
            esta lista todavía no le aparece a nadie. Empieza a usarse en cuanto marques sabores
            dentro de un producto, en <strong>Productos → Sabores que puede elegir el cliente</strong>.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {creating && (
          <SaborForm
            idsExistentes={items.map((s) => s.id)}
            onSave={guardar}
            onCancel={() => setCreating(false)}
          />
        )}
        {editing && (
          <SaborForm
            initial={editing}
            idsExistentes={items.map((s) => s.id)}
            onSave={guardar}
            onCancel={() => setEditing(null)}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {items.map((s, i) => {
            const uso = usoPorSabor(s.id)
            return (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`flex items-center gap-2 rounded-2xl bg-white p-3 shadow-card ${
                  s.activo ? '' : 'opacity-60'
                }`}
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => mover(i, -1)}
                    disabled={i === 0}
                    aria-label={`Subir ${s.nombre}`}
                    className="flex h-5 w-6 items-center justify-center text-gray-400 disabled:opacity-25"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => mover(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label={`Bajar ${s.nombre}`}
                    className="flex h-5 w-6 items-center justify-center text-gray-400 disabled:opacity-25"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                <span className="w-8 text-center text-xl">{s.emoji}</span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-app-text">{s.nombre}</p>
                  <p className="text-xs text-app-muted">
                    {s.precioExtra > 0 ? `+$${s.precioExtra}` : 'Sin costo extra'}
                    {uso > 0 && ` · en ${uso} producto${uso > 1 ? 's' : ''}`}
                    {!s.activo && ' · oculto'}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setItems(items.map((x) => (x.id === s.id ? { ...x, activo: !x.activo } : x)))
                  }
                  aria-label={s.activo ? `Ocultar ${s.nombre}` : `Mostrar ${s.nombre}`}
                  aria-pressed={s.activo}
                  className={`flex-shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${
                    s.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {s.activo ? 'Activo' : 'Oculto'}
                </button>
                <button
                  onClick={() => setEditing(s)}
                  aria-label={`Editar ${s.nombre}`}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50"
                >
                  <Pencil size={13} className="text-blue-500" />
                </button>
                <button
                  onClick={() => eliminar(s.id)}
                  aria-label={`Eliminar ${s.nombre}`}
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
        nombreExport="sabores"
        datos={items}
        hayBorrador={hayBorrador}
        onDescartar={descartar}
      />
    </div>
  )
}
