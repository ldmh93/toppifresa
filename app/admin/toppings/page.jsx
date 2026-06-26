'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, ChevronDown } from 'lucide-react'
import { toppingCategories as staticCats } from '@/lib/data/toppings'

const CATEGORY_COLORS = ['#D63864','#A855F7','#F5B731','#25D366','#3B82F6','#F97316','#EC4899','#14B8A6']

function ItemRow({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
      <span className="text-lg w-7 text-center">{item.emoji}</span>
      <span className="flex-1 text-sm font-medium text-app-text">{item.name}</span>
      <button onClick={() => onEdit(item)} className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
        <Pencil size={12} className="text-blue-500" />
      </button>
      <button onClick={() => onDelete(item.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
        <Trash2 size={12} className="text-red-400" />
      </button>
    </div>
  )
}

function InlineForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [emoji, setEmoji] = useState(initial?.emoji || '✨')

  return (
    <div className="flex items-center gap-2 py-2 bg-gray-50 rounded-xl px-2 mb-2">
      <input
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
        className="w-10 text-center text-lg bg-white border border-gray-200 rounded-lg py-1 outline-none"
        maxLength={2}
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del topping"
        className="flex-1 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
        onKeyDown={(e) => e.key === 'Enter' && name.trim() && onSave({ name: name.trim(), emoji })}
      />
      <button
        onClick={() => name.trim() && onSave({ name: name.trim(), emoji })}
        className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
      >
        <Check size={14} className="text-white" />
      </button>
      <button onClick={onCancel} className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
        <X size={14} />
      </button>
    </div>
  )
}

function CategoryCard({ category, onChange, onDelete }) {
  const [open, setOpen] = useState(true)
  const [addingItem, setAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editingCat, setEditingCat] = useState(false)
  const [catName, setCatName] = useState(category.name)
  const [catEmoji, setCatEmoji] = useState(category.emoji)

  const addItem = ({ name, emoji }) => {
    const item = { id: `item-${Date.now()}`, name, emoji }
    onChange({ ...category, items: [...category.items, item] })
    setAddingItem(false)
  }

  const updateItem = (itemId, { name, emoji }) => {
    onChange({
      ...category,
      items: category.items.map((i) => i.id === itemId ? { ...i, name, emoji } : i),
    })
    setEditingItem(null)
  }

  const deleteItem = (itemId) => {
    onChange({ ...category, items: category.items.filter((i) => i.id !== itemId) })
  }

  const saveCatName = () => {
    onChange({ ...category, name: catName, emoji: catEmoji })
    setEditingCat(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-3">
      {/* Category header */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ background: `${category.color}15`, borderBottom: `2px solid ${category.color}30` }}
      >
        {editingCat ? (
          <div className="flex items-center gap-2 flex-1">
            <input value={catEmoji} onChange={(e) => setCatEmoji(e.target.value)}
              className="w-10 text-center text-lg border border-gray-200 rounded-lg py-1 outline-none" maxLength={2} />
            <input value={catName} onChange={(e) => setCatName(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            <button onClick={saveCatName} className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Check size={12} className="text-white" />
            </button>
            <button onClick={() => setEditingCat(false)} className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center">
              <X size={12} />
            </button>
          </div>
        ) : (
          <>
            <span className="text-xl">{category.emoji}</span>
            <span className="flex-1 font-bold text-app-text text-sm">{category.name}</span>
            <span className="text-xs text-app-muted">{category.items.length} items</span>
            <button onClick={() => setEditingCat(true)} className="w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center">
              <Pencil size={12} style={{ color: category.color }} />
            </button>
            <button onClick={() => onDelete(category.id)} className="w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center">
              <Trash2 size={12} className="text-red-400" />
            </button>
            <button onClick={() => setOpen((v) => !v)} className="w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center">
              <motion.span animate={{ rotate: open ? 180 : 0 }}>
                <ChevronDown size={14} className="text-gray-500" />
              </motion.span>
            </button>
          </>
        )}
      </div>

      {/* Items */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden px-4 pt-1 pb-3"
          >
            {addingItem && (
              <InlineForm onSave={addItem} onCancel={() => setAddingItem(false)} />
            )}
            {category.items.map((item) =>
              editingItem?.id === item.id ? (
                <InlineForm
                  key={item.id}
                  initial={item}
                  onSave={(data) => updateItem(item.id, data)}
                  onCancel={() => setEditingItem(null)}
                />
              ) : (
                <ItemRow
                  key={item.id}
                  item={item}
                  onEdit={setEditingItem}
                  onDelete={deleteItem}
                />
              )
            )}
            {!addingItem && (
              <button
                onClick={() => setAddingItem(true)}
                className="flex items-center gap-1.5 text-xs font-semibold mt-2"
                style={{ color: category.color }}
              >
                <Plus size={13} /> Agregar ingrediente
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminToppings() {
  const [categories, setCategories] = useState(staticCats)
  const [addingCat, setAddingCat] = useState(false)
  const [newCat, setNewCat] = useState({ name: '', emoji: '✨', color: CATEGORY_COLORS[0], items: [] })

  const updateCategory = (id, data) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? data : c)))
  }

  const deleteCategory = (id) => {
    if (confirm('¿Eliminar esta categoría?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const createCategory = () => {
    if (!newCat.name.trim()) return
    setCategories((prev) => [...prev, { ...newCat, id: `cat-${Date.now()}` }])
    setNewCat({ name: '', emoji: '✨', color: CATEGORY_COLORS[0], items: [] })
    setAddingCat(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-app-text">Toppings ✨</h1>
          <p className="text-app-muted text-xs">{categories.length} categorías · {categories.reduce((a, c) => a + c.items.length, 0)} ingredientes</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setAddingCat(true)}
          className="flex items-center gap-1.5 bg-primary text-white font-bold text-sm px-4 py-2.5 rounded-2xl shadow-fab"
        >
          <Plus size={18} /> Categoría
        </motion.button>
      </div>

      {/* New category form */}
      <AnimatePresence>
        {addingCat && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl shadow-card p-4 mb-4"
          >
            <p className="font-bold text-sm text-app-text mb-3">Nueva categoría</p>
            <div className="flex gap-2 mb-3">
              <input value={newCat.emoji} onChange={(e) => setNewCat((n) => ({ ...n, emoji: e.target.value }))}
                className="w-12 text-center text-xl border border-gray-200 rounded-xl py-2 outline-none" maxLength={2} />
              <input value={newCat.name} onChange={(e) => setNewCat((n) => ({ ...n, name: e.target.value }))}
                placeholder="Nombre de categoría" className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary" />
            </div>
            <div className="flex gap-2 mb-3">
              {CATEGORY_COLORS.map((c) => (
                <button key={c} onClick={() => setNewCat((n) => ({ ...n, color: c }))}
                  className={`w-7 h-7 rounded-full border-2 ${newCat.color === c ? 'border-gray-600 scale-110' : 'border-transparent'}`}
                  style={{ background: c }} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setAddingCat(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 font-semibold">Cancelar</button>
              <button onClick={createCategory} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold">Crear</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          onChange={(data) => updateCategory(cat.id, data)}
          onDelete={deleteCategory}
        />
      ))}

      <p className="text-center text-xs text-app-muted mt-4 px-4">
        💡 Conecta Firebase en <code>.env.local</code> para guardar cambios permanentemente.
      </p>
    </div>
  )
}
