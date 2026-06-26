'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react'
import { promos as staticPromos } from '@/lib/data/promos'

const EMPTY_PROMO = {
  title: '', subtitle: '', description: '', tag: 'HOY',
  urgency: '', cta: 'Aprovechar ahora', emoji: '🎉',
  whatsappMsg: '', active: true,
  colors: { from: '#D63864', to: '#9B1C40', accent: '#FFD700' },
}

const TAGS = ['HOY', 'FIN DE SEMANA', 'ESPECIAL', 'NUEVO', 'ENTREGA']

function PromoForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_PROMO)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setColor = (k, v) => setForm((f) => ({ ...f, colors: { ...f.colors, [k]: v } }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white rounded-2xl shadow-card-hover border border-app-border overflow-hidden mb-4"
    >
      {/* Preview */}
      <div
        className="h-20 flex items-center px-4 gap-3 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${form.colors.from}, ${form.colors.to})` }}
      >
        <div className="flex-1">
          <p className="text-white/60 text-xs font-bold">{form.tag}</p>
          <p className="text-white font-black text-lg leading-tight">{form.title || 'Título de la promo'}</p>
          <p className="text-white/70 text-xs">{form.subtitle}</p>
        </div>
        <span className="text-4xl">{form.emoji}</span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Emoji + Tag */}
        <div className="flex gap-3">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Emoji</label>
            <input value={form.emoji} onChange={(e) => set('emoji', e.target.value)}
              className="w-14 text-center text-2xl border border-gray-200 rounded-xl py-2 outline-none" maxLength={2} />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 mb-1 block">Etiqueta</label>
            <select value={form.tag} onChange={(e) => set('tag', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary">
              {TAGS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Activa</label>
            <button onClick={() => set('active', !form.active)}
              className={`w-14 h-10 rounded-xl flex items-center justify-center border-2 ${form.active ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
              {form.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Fields */}
        {[
          ['title', 'Título', '2×1 en ToppiOreo'],
          ['subtitle', 'Subtítulo', 'Solo hoy — pedido mínimo 2 piezas'],
          ['urgency', 'Texto de urgencia', 'Quedan pocas horas'],
          ['cta', 'Texto del botón', 'Aprovechar ahora'],
        ].map(([key, label, ph]) => (
          <div key={key}>
            <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>
            <input value={form[key]} onChange={(e) => set(key, e.target.value)}
              placeholder={ph}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary" />
          </div>
        ))}

        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Descripción</label>
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
            rows={2} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary resize-none" />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Mensaje WhatsApp</label>
          <textarea value={form.whatsappMsg} onChange={(e) => set('whatsappMsg', e.target.value)}
            rows={2} placeholder="Hola! Quiero aprovechar la promo..."
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary resize-none" />
        </div>

        {/* Colors */}
        <div>
          <label className="text-xs font-bold text-gray-500 mb-2 block">Colores</label>
          <div className="flex gap-2">
            {[['from', 'Inicio'], ['to', 'Fin'], ['accent', 'Acento']].map(([key, label]) => (
              <label key={key} className="flex-1">
                <p className="text-[10px] text-gray-400 mb-1 text-center">{label}</p>
                <input type="color" value={form.colors[key] || '#ffffff'}
                  onChange={(e) => setColor(key, e.target.value)}
                  className="w-full h-9 rounded-xl border border-gray-200 cursor-pointer" />
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Cancelar</button>
          <button onClick={() => onSave(form)} disabled={!form.title.trim()}
            className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
            <Check size={16} /> Guardar
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function PromoItem({ promo, onEdit, onDelete, onToggle }) {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="h-14 flex items-center px-4 gap-3"
        style={{ background: `linear-gradient(135deg, ${promo.colors.from}, ${promo.colors.to})` }}>
        <span className="text-2xl">{promo.emoji}</span>
        <div className="flex-1">
          <p className="text-white font-bold text-sm leading-tight">{promo.title}</p>
          <p className="text-white/60 text-xs">{promo.tag}</p>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${promo.active ? 'bg-green-400 text-white' : 'bg-white/30 text-white/60'}`}>
          {promo.active ? 'Activa' : 'Inactiva'}
        </div>
      </div>
      <div className="px-4 py-2.5 flex items-center gap-2">
        <p className="text-xs text-app-muted flex-1 line-clamp-1">{promo.description}</p>
        <button onClick={() => onToggle(promo.id)} className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
          {promo.active ? <ToggleRight size={16} className="text-green-500" /> : <ToggleLeft size={16} className="text-gray-400" />}
        </button>
        <button onClick={() => onEdit(promo)} className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <Pencil size={14} className="text-blue-500" />
        </button>
        <button onClick={() => onDelete(promo.id)} className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>
    </motion.div>
  )
}

export default function AdminPromos() {
  const [items, setItems] = useState(staticPromos)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const handleSave = (form) => {
    if (editing) {
      setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form } : p)))
      setEditing(null)
    } else {
      setItems((prev) => [...prev, { ...form, id: `promo-${Date.now()}` }])
      setCreating(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-app-text">Promos 🎉</h1>
          <p className="text-app-muted text-xs">{items.filter((p) => p.active).length} activas · {items.length} total</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { setCreating(true); setEditing(null) }}
          className="flex items-center gap-1.5 bg-primary text-white font-bold text-sm px-4 py-2.5 rounded-2xl shadow-fab">
          <Plus size={18} /> Nueva
        </motion.button>
      </div>

      <AnimatePresence>
        {creating && <PromoForm onSave={handleSave} onCancel={() => setCreating(false)} />}
        {editing && <PromoForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
      </AnimatePresence>

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {items.map((p) => (
            <PromoItem key={p.id} promo={p}
              onEdit={(promo) => { setEditing(promo); setCreating(false) }}
              onDelete={(id) => setItems((prev) => prev.filter((x) => x.id !== id))}
              onToggle={(id) => setItems((prev) => prev.map((x) => x.id === id ? { ...x, active: !x.active } : x))}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
