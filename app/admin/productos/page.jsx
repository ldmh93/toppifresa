'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Pencil, Trash2, X, Check, Image as ImageIcon,
  ChevronUp, ChevronDown, PackageX, PackageCheck,
} from 'lucide-react'
import { products as publicados, ESTADOS } from '@/lib/data/products'
import { getCategoriasActivas } from '@/lib/data/categorias'
import { sabores as catalogoSabores } from '@/lib/data/sabores'
import { useBorrador } from '@/lib/admin/borrador'
import BarraPublicar from '@/components/admin/BarraPublicar'

const EMOJIS = ['🍓', '🍪', '🍑', '🌰', '🍫', '🌸', '🌶️', '🥞', '🍦', '🎂', '🍰', '🧁']

const FORM_VACIO = {
  name: '', tagline: '', description: '',
  emoji: '🍓', tag: 'Clásico',
  colors: { from: '#B5191A', to: '#6B0306', text: '#ffffff' },
  popular: false, isNew: false,
  incluye: [],
  price: '',
  imageUrl: '',
  estado: 'disponible',
  sabores: [],
}

/** Convierte "ToppiOreo" en "toppi-oreo" para usarlo como id. */
function generarId(nombre) {
  const base = String(nombre)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return base || `producto-${Date.now()}`
}

function Campo({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
        {label}
        {hint && <span className="ml-1 font-normal normal-case text-gray-400">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

function ProductForm({ initial, idsExistentes, onSave, onCancel }) {
  const [form, setForm] = useState(initial || FORM_VACIO)
  const [incluyeInput, setIncluyeInput] = useState('')

  const esNuevo = !initial
  const idPropuesto = esNuevo ? generarId(form.name) : initial.id
  const idRepetido = esNuevo && idPropuesto && idsExistentes.includes(idPropuesto)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const setColor = (key, val) => setForm((f) => ({ ...f, colors: { ...f.colors, [key]: val } }))

  const addIncluye = () => {
    const t = incluyeInput.trim()
    if (t && !form.incluye.includes(t)) set('incluye', [...form.incluye, t])
    setIncluyeInput('')
  }

  const toggleSabor = (id) =>
    set('sabores', form.sabores.includes(id)
      ? form.sabores.filter((s) => s !== id)
      : [...form.sabores, id])

  const puedeGuardar = form.name.trim() && !idRepetido && Number(form.price) > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="overflow-hidden rounded-2xl border border-app-border bg-white shadow-card-hover"
    >
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <p className="text-sm font-bold text-app-text">
          {initial ? `Editar ${initial.name}` : 'Nuevo producto'}
        </p>
        <button
          onClick={onCancel}
          aria-label="Cerrar formulario"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Vista previa */}
        <div
          className="relative flex h-20 items-center gap-3 overflow-hidden rounded-2xl px-4"
          style={{ background: `linear-gradient(135deg, ${form.colors.from}, ${form.colors.to})` }}
        >
          <span className="text-4xl">{form.emoji}</span>
          <div>
            <p
              className="text-base font-black leading-tight"
              style={{ color: form.colors.text }}
            >
              {form.name || 'Nombre del producto'}
            </p>
            <p className="text-xs opacity-75" style={{ color: form.colors.text }}>
              {form.tagline || 'Tagline…'}
            </p>
          </div>
        </div>

        {/* Identificador */}
        <Campo label="Identificador" hint={esNuevo ? '(se genera del nombre)' : '(no se puede cambiar)'}>
          <p
            className={`rounded-xl border px-3 py-2 font-mono text-xs ${
              idRepetido
                ? 'border-red-300 bg-red-50 text-red-700'
                : 'border-gray-200 bg-gray-50 text-gray-600'
            }`}
          >
            {idPropuesto || '—'}
          </p>
          {idRepetido && (
            <p className="mt-1 text-xs font-semibold text-red-600">
              Ya existe un producto con este identificador. Cambia el nombre.
            </p>
          )}
          {!esNuevo && (
            <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
              Cambiarlo rompería los carritos que tus clientes ya tienen guardados.
            </p>
          )}
        </Campo>

        {/* Emoji */}
        <Campo label="Emoji">
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => set('emoji', e)}
                aria-pressed={form.emoji === e}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 text-xl transition-all ${
                  form.emoji === e ? 'border-primary bg-primary-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </Campo>

        {/* Colores */}
        <Campo label="Colores de la tarjeta">
          <div className="flex flex-wrap gap-3">
            {[['from', 'Inicio'], ['to', 'Fin']].map(([key, label]) => (
              <label key={key} className="flex-1">
                <p className="mb-1 text-xs text-gray-500">{label}</p>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
                  <input
                    type="color"
                    value={form.colors[key]}
                    onChange={(e) => setColor(key, e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded-lg border-0"
                    aria-label={`Color ${label}`}
                  />
                  <span className="font-mono text-xs text-gray-600">{form.colors[key]}</span>
                </div>
              </label>
            ))}
            <div>
              <p className="mb-1 text-xs text-gray-500">Texto</p>
              <div className="mt-1 flex gap-1.5">
                {['#ffffff', '#241012'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor('text', c)}
                    aria-label={c === '#ffffff' ? 'Texto blanco' : 'Texto oscuro'}
                    aria-pressed={form.colors.text === c}
                    className={`h-8 w-8 rounded-lg border-2 ${
                      form.colors.text === c ? 'border-primary' : 'border-gray-200'
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Campo>

        {[
          ['name', 'Nombre', 'ToppiOreo'],
          ['tagline', 'Tagline', 'Dulzura + crunch = felicidad'],
        ].map(([key, label, ph]) => (
          <Campo key={key} label={label}>
            <input
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={ph}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </Campo>
        ))}

        <Campo label="Descripción">
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Campo>

        {/* Categoría + distintivos */}
        <div className="flex flex-wrap gap-3">
          <div className="min-w-[140px] flex-1">
            <Campo label="Categoría">
              <select
                value={form.tag}
                onChange={(e) => set('tag', e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {getCategoriasActivas().map((c) => (
                  <option key={c.id}>{c.id}</option>
                ))}
              </select>
            </Campo>
          </div>
          <Campo label="Distintivos">
            <div className="flex gap-2">
              {[['popular', '🔥', 'Marcar como más pedido'], ['isNew', '✨', 'Marcar como nuevo']].map(
                ([key, icon, etiqueta]) => (
                  <button
                    key={key}
                    onClick={() => set(key, !form[key])}
                    aria-label={etiqueta}
                    aria-pressed={form[key]}
                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-all ${
                      form[key]
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                    }`}
                  >
                    {icon}
                  </button>
                ),
              )}
            </div>
          </Campo>
        </div>

        {/* Disponibilidad */}
        <Campo label="Disponibilidad">
          <div className="flex flex-wrap gap-2">
            {Object.entries(ESTADOS).map(([clave, info]) => (
              <button
                key={clave}
                onClick={() => set('estado', clave)}
                aria-pressed={form.estado === clave}
                className={`rounded-xl border-2 px-3 py-2 text-xs font-bold transition-all ${
                  form.estado === clave
                    ? 'border-transparent text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
                style={form.estado === clave ? { background: info.color } : undefined}
              >
                {info.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400">
            <strong>Agotado</strong> se muestra en el menú en gris y sin poder pedirse.{' '}
            <strong>No disponible por ahora</strong> lo esconde por completo.
          </p>
        </Campo>

        <Campo label="URL de imagen" hint="(opcional, si tienes foto)">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
            <ImageIcon size={16} className="flex-shrink-0 text-gray-400" />
            <input
              value={form.imageUrl || ''}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://…/mi-foto.jpg"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </Campo>

        <Campo label="Precio">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={form.price}
              onChange={(e) => set('price', Number(e.target.value))}
              placeholder="65"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-7 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </Campo>

        {/* Ingredientes incluidos */}
        <Campo label="Ingredientes incluidos" hint="(lo que ya trae de fábrica)">
          <div className="mb-2 flex gap-2">
            <input
              value={incluyeInput}
              onChange={(e) => setIncluyeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addIncluye()
                }
              }}
              placeholder="Escribe y presiona Enter"
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={addIncluye}
              aria-label="Agregar ingrediente"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {form.incluye.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {t}
                <button
                  onClick={() => set('incluye', form.incluye.filter((x) => x !== t))}
                  aria-label={`Quitar ${t}`}
                  className="transition-colors hover:text-red-500"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </Campo>

        {/* Sabores seleccionables */}
        <Campo label="Sabores que puede elegir el cliente" hint="(opcional)">
          <div className="flex flex-wrap gap-1.5">
            {catalogoSabores.map((s) => {
              const activo = form.sabores.includes(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSabor(s.id)}
                  aria-pressed={activo}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-all ${
                    activo
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                >
                  {s.emoji} {s.nombre}
                  {s.precioExtra > 0 && ` +$${s.precioExtra}`}
                </button>
              )
            })}
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400">
            Si no marcas ninguno, el producto se vende tal cual (así funciona hoy todo el menú).
          </p>
        </Campo>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave({ ...form, id: idPropuesto, price: Number(form.price) })}
            disabled={!puedeGuardar}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            <Check size={16} /> Guardar
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ProductItem({ product, primero, ultimo, onEdit, onDelete, onMover, onToggleEstado }) {
  const info = ESTADOS[product.estado] ?? ESTADOS.disponible
  const vendible = info.vendible

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="overflow-hidden rounded-2xl bg-white shadow-card"
    >
      <div
        className="flex h-14 items-center gap-3 px-4"
        style={{
          background: `linear-gradient(135deg, ${product.colors.from}, ${product.colors.to})`,
          filter: vendible ? 'none' : 'grayscale(0.7)',
        }}
      >
        <span className="text-2xl">{product.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold leading-tight" style={{ color: product.colors.text }}>
            {product.name}
          </p>
          <p className="text-xs opacity-70" style={{ color: product.colors.text }}>
            {product.tag}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {product.popular && <span className="text-xs">🔥</span>}
          {product.isNew && <span className="text-xs">✨</span>}
          <p className="text-sm font-black" style={{ color: product.colors.text }}>
            ${product.price}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Reordenar */}
        <div className="flex flex-shrink-0 flex-col">
          <button
            onClick={() => onMover(-1)}
            disabled={primero}
            aria-label={`Subir ${product.name}`}
            className="flex h-5 w-6 items-center justify-center rounded text-gray-400 disabled:opacity-25"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={() => onMover(1)}
            disabled={ultimo}
            aria-label={`Bajar ${product.name}`}
            className="flex h-5 w-6 items-center justify-center rounded text-gray-400 disabled:opacity-25"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        <span
          className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
          style={{ background: info.color }}
        >
          {info.label}
        </span>

        <p className="min-w-0 flex-1 truncate text-xs text-app-muted">{product.description}</p>

        <div className="flex flex-shrink-0 gap-1.5">
          <button
            onClick={onToggleEstado}
            aria-label={vendible ? `Marcar ${product.name} como agotado` : `Marcar ${product.name} como disponible`}
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              vendible ? 'bg-amber-50' : 'bg-emerald-50'
            }`}
          >
            {vendible ? (
              <PackageX size={14} className="text-amber-600" />
            ) : (
              <PackageCheck size={14} className="text-emerald-600" />
            )}
          </button>
          <button
            onClick={() => onEdit(product)}
            aria-label={`Editar ${product.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50"
          >
            <Pencil size={14} className="text-blue-500" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            aria-label={`Eliminar ${product.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50"
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminProductos() {
  const [items, setItems, { hidratado, hayBorrador, descartar }] = useBorrador(
    'productos',
    publicados,
  )
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  // `orden` se recalcula siempre desde la posición en la lista: así lo que
  // ves aquí es exactamente lo que verá el cliente.
  const renumerar = (lista) => lista.map((p, i) => ({ ...p, orden: i + 1 }))

  const handleSave = (form) => {
    if (editing) {
      setItems(renumerar(items.map((p) => (p.id === editing.id ? { ...p, ...form } : p))))
      setEditing(null)
    } else {
      setItems(renumerar([...items, form]))
      setCreating(false)
    }
  }

  const handleDelete = (id) => {
    const p = items.find((x) => x.id === id)
    if (confirm(`¿Eliminar "${p?.name}" del menú?\n\nSi solo se acabó por hoy, mejor márcalo como agotado.`)) {
      setItems(renumerar(items.filter((x) => x.id !== id)))
    }
  }

  const mover = (indice, direccion) => {
    const destino = indice + direccion
    if (destino < 0 || destino >= items.length) return
    const copia = [...items]
    ;[copia[indice], copia[destino]] = [copia[destino], copia[indice]]
    setItems(renumerar(copia))
  }

  const toggleEstado = (id) =>
    setItems(
      items.map((p) =>
        p.id === id
          ? { ...p, estado: ESTADOS[p.estado]?.vendible ? 'agotado' : 'disponible' }
          : p,
      ),
    )

  // Evita el parpadeo entre el HTML del servidor y el borrador del navegador.
  if (!hidratado) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white/60" />
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-black text-app-text">Productos 🍓</h1>
          <p className="text-xs text-app-muted">{items.length} en el menú</p>
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

      <AnimatePresence>
        {creating && (
          <div className="mb-4">
            <ProductForm
              idsExistentes={items.map((p) => p.id)}
              onSave={handleSave}
              onCancel={() => setCreating(false)}
            />
          </div>
        )}
        {editing && (
          <div className="mb-4">
            <ProductForm
              initial={editing}
              idsExistentes={items.map((p) => p.id)}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {items.map((p, i) => (
            <ProductItem
              key={p.id}
              product={p}
              primero={i === 0}
              ultimo={i === items.length - 1}
              onEdit={(prod) => {
                setEditing(prod)
                setCreating(false)
              }}
              onDelete={handleDelete}
              onMover={(dir) => mover(i, dir)}
              onToggleEstado={() => toggleEstado(p.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <BarraPublicar
        nombreExport="products"
        datos={items}
        hayBorrador={hayBorrador}
        onDescartar={descartar}
      />
    </div>
  )
}
