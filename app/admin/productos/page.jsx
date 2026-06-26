'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Pencil, Trash2, X, Check, Image as ImageIcon,
  GripVertical, ChevronDown, ChevronUp,
} from 'lucide-react'
import { products as staticProducts } from '@/lib/data/products'

const TAGS = ['Clásico', 'Favorito', 'Especial', 'Premium', 'Mexicano', 'Picante', 'Nuevo']
const EMOJIS = ['🍓', '🍪', '🍑', '🌰', '🍫', '🌸', '🌶️', '🥞', '🍦', '🎂', '🍰', '🧁']

const EMPTY_FORM = {
  name: '', tagline: '', description: '',
  emoji: '🍓', tag: 'Clásico',
  colors: { from: '#E8194A', to: '#B02952', text: '#ffffff' },
  popular: false, isNew: false,
  toppings: [],
  sizes: [{ name: 'Regular', price: '' }],
  imageUrl: '',
}

function SizeRow({ size, onChange, onRemove, canRemove }) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={size.name}
        onChange={(e) => onChange({ ...size, name: e.target.value })}
        placeholder="Nombre (Chico, Regular…)"
        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
      />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <input
          type="number"
          value={size.price}
          onChange={(e) => onChange({ ...size, price: Number(e.target.value) })}
          placeholder="Precio"
          className="w-24 pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
        />
      </div>
      {canRemove && (
        <button onClick={onRemove} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600">
          <X size={16} />
        </button>
      )}
    </div>
  )
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const [toppingInput, setToppingInput] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const setColor = (key, val) => setForm((f) => ({ ...f, colors: { ...f.colors, [key]: val } }))

  const addTopping = () => {
    const t = toppingInput.trim()
    if (t && !form.toppings.includes(t)) {
      set('toppings', [...form.toppings, t])
    }
    setToppingInput('')
  }

  const removeTopping = (t) => set('toppings', form.toppings.filter((x) => x !== t))

  const addSize = () => set('sizes', [...form.sizes, { name: '', price: '' }])
  const updateSize = (i, val) => {
    const s = [...form.sizes]
    s[i] = val
    set('sizes', s)
  }
  const removeSize = (i) => set('sizes', form.sizes.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-2xl shadow-card-hover border border-app-border overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <p className="font-bold text-app-text text-sm">{initial ? 'Editar producto' : 'Nuevo producto'}</p>
        <button onClick={onCancel} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
          <X size={14} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Preview strip */}
        <div
          className="rounded-2xl h-20 flex items-center px-4 gap-3 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${form.colors.from}, ${form.colors.to})` }}
        >
          <span className="text-4xl">{form.emoji}</span>
          <div>
            <p className="text-white font-black text-base leading-tight">{form.name || 'Nombre del producto'}</p>
            <p className="text-white/70 text-xs">{form.tagline || 'Tagline…'}</p>
          </div>
        </div>

        {/* Emoji picker */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Emoji</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => set('emoji', e)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                  form.emoji === e ? 'border-primary bg-primary-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Colores del card</label>
          <div className="flex gap-3">
            {[['from', 'Color inicio'], ['to', 'Color fin']].map(([key, label]) => (
              <label key={key} className="flex-1">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2">
                  <input
                    type="color"
                    value={form.colors[key]}
                    onChange={(e) => setColor(key, e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 font-mono">{form.colors[key]}</span>
                </div>
              </label>
            ))}
            <label>
              <p className="text-xs text-gray-500 mb-1">Texto</p>
              <div className="flex gap-1.5 mt-1">
                {['#ffffff', '#1C1C1E'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor('text', c)}
                    className={`w-8 h-8 rounded-lg border-2 ${form.colors.text === c ? 'border-primary' : 'border-gray-200'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </label>
          </div>
        </div>

        {/* Name + Tagline */}
        {[
          ['name', 'Nombre', 'ToppiOreo'],
          ['tagline', 'Tagline', 'Dulzura + crunch = felicidad'],
        ].map(([key, label, ph]) => (
          <div key={key}>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
            <input
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={ph}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
            />
          </div>
        ))}

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Tag + toggles */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Categoría</label>
            <select
              value={form.tag}
              onChange={(e) => set('tag', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
            >
              {TAGS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Opciones</label>
            <div className="flex gap-2">
              {[['popular', '🔥'], ['isNew', '✨']].map(([key, icon]) => (
                <button
                  key={key}
                  onClick={() => set(key, !form[key])}
                  className={`flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    form[key] ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
            URL de imagen <span className="normal-case text-gray-400 font-normal">(opcional, si tienes foto)</span>
          </label>
          <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
            <ImageIcon size={16} className="text-gray-400 flex-shrink-0" />
            <input
              value={form.imageUrl || ''}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://…/mi-foto.jpg"
              className="flex-1 text-sm bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tamaños y precios</label>
          <div className="flex flex-col gap-2">
            {form.sizes.map((s, i) => (
              <SizeRow
                key={i}
                size={s}
                onChange={(val) => updateSize(i, val)}
                onRemove={() => removeSize(i)}
                canRemove={form.sizes.length > 1}
              />
            ))}
            <button
              onClick={addSize}
              className="flex items-center gap-1.5 text-primary text-sm font-semibold py-1"
            >
              <Plus size={15} /> Agregar tamaño
            </button>
          </div>
        </div>

        {/* Toppings */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Ingredientes incluidos</label>
          <div className="flex gap-2 mb-2">
            <input
              value={toppingInput}
              onChange={(e) => setToppingInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTopping()}
              placeholder="Escribe y presiona Enter"
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
            />
            <button
              onClick={addTopping}
              className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {form.toppings.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 bg-primary-50 text-primary text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {t}
                <button onClick={() => removeTopping(t)} className="hover:text-red-500 transition-colors">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-sm"
          >
            Cancelar
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
            className="flex-2 flex-1 py-3 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Check size={16} /> Guardar</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function ProductItem({ product, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white rounded-2xl shadow-card overflow-hidden"
    >
      <div
        className="h-14 flex items-center px-4 gap-3"
        style={{ background: `linear-gradient(135deg, ${product.colors.from}, ${product.colors.to})` }}
      >
        <span className="text-2xl">{product.emoji}</span>
        <div className="flex-1">
          <p className="text-white font-bold text-sm leading-tight">{product.name}</p>
          <p className="text-white/70 text-xs">{product.tag}</p>
        </div>
        <div className="flex items-center gap-2">
          {product.popular && <span className="text-amber-300 text-xs">🔥</span>}
          {product.isNew && <span className="text-emerald-300 text-xs">✨</span>}
          <p className="text-white font-black text-sm">
            ${product.sizes[product.sizes.length > 1 ? 1 : 0]?.price}
          </p>
        </div>
      </div>
      <div className="px-4 py-2.5 flex items-center justify-between">
        <p className="text-xs text-app-muted line-clamp-1 flex-1 mr-3">{product.description}</p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(product)}
            className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center"
          >
            <Pencil size={14} className="text-blue-500" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center"
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminProductos() {
  const [items, setItems] = useState(staticProducts)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const handleSave = async (form) => {
    if (editing) {
      setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form } : p)))
      setEditing(null)
    } else {
      const newProduct = { ...form, id: `toppi-${Date.now()}` }
      setItems((prev) => [...prev, newProduct])
      setCreating(false)
    }
  }

  const handleDelete = (id) => {
    if (confirm('¿Eliminar este producto?')) {
      setItems((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-app-text">Productos 🍓</h1>
          <p className="text-app-muted text-xs">{items.length} en el menú</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setCreating(true); setEditing(null) }}
          className="flex items-center gap-1.5 bg-primary text-white font-bold text-sm px-4 py-2.5 rounded-2xl shadow-fab"
        >
          <Plus size={18} /> Nuevo
        </motion.button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {creating && (
          <div className="mb-4">
            <ProductForm
              onSave={handleSave}
              onCancel={() => setCreating(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Edit form */}
      <AnimatePresence>
        {editing && (
          <div className="mb-4">
            <ProductForm
              initial={editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {items.map((p) => (
            <ProductItem
              key={p.id}
              product={p}
              onEdit={(prod) => { setEditing(prod); setCreating(false) }}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      <p className="text-center text-xs text-app-muted mt-6 px-4">
        💡 Conecta Firebase en <code>.env.local</code> para guardar cambios permanentemente.
      </p>
    </div>
  )
}
