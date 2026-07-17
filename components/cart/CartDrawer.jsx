'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Send, Store, Bike,
  StickyNote, TicketPercent, Star, AlertTriangle, CheckCircle2, User, Phone,
} from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { products } from '@/lib/data/products'
import { getWhatsAppURL } from '@/lib/utils/whatsapp'
import {
  PEDIDO_MINIMO_DOMICILIO,
  ENVIO_ZONA_CENTRO,
  MENSAJE_MINIMO_DOMICILIO,
  buildCartMessage,
} from '@/lib/cart/config'

/* ---------- Item del carrito ---------- */
function CartItem({ item }) {
  const { updateQty, updateNote, removeItem } = useCart()
  const [showNote, setShowNote] = useState(!!item.note)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, height: 0, marginBottom: 0 }}
      className="bg-white rounded-2xl p-3 shadow-card mb-2.5"
    >
      <div className="flex items-center gap-3">
        {/* Imagen (emoji sobre gradiente del producto) */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: item.colors
              ? `linear-gradient(135deg, ${item.colors.from}22, ${item.colors.to}22)`
              : '#FFF0F3',
          }}
        >
          {item.emoji}
        </div>

        {/* Nombre + precio unitario */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-app-text text-sm truncate">{item.name}</p>
          <p className="text-app-muted text-xs">${item.price} c/u</p>
          <button
            onClick={() => setShowNote((v) => !v)}
            className="flex items-center gap-1 text-[11px] text-app-muted mt-0.5"
          >
            <StickyNote size={11} />
            {item.note ? 'Editar nota' : 'Agregar nota'}
          </button>
        </div>

        {/* Stepper + subtotal */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5 bg-app-bg rounded-xl p-1">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => (item.qty === 1 ? removeItem(item.id) : updateQty(item.id, item.qty - 1))}
              aria-label={item.qty === 1 ? 'Eliminar del carrito' : 'Disminuir cantidad'}
              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"
            >
              {item.qty === 1 ? (
                <Trash2 size={14} className="text-red-400" />
              ) : (
                <Minus size={14} className="text-app-text" />
              )}
            </motion.button>
            <span className="font-black text-app-text text-sm w-5 text-center" aria-live="polite">{item.qty}</span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => updateQty(item.id, item.qty + 1)}
              aria-label="Aumentar cantidad"
              className="w-8 h-8 rounded-lg bg-primary shadow-sm flex items-center justify-center"
            >
              <Plus size={14} className="text-white" />
            </motion.button>
          </div>
          <motion.p key={item.qty} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="font-black text-primary text-sm">
            ${item.price * item.qty}
          </motion.p>
        </div>
      </div>

      <AnimatePresence>
        {showNote && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <input
              type="text"
              value={item.note}
              onChange={(e) => updateNote(item.id, e.target.value)}
              placeholder="Ej: sin chamoy, extra crema..."
              className="w-full mt-2.5 px-3 py-2 bg-app-bg border border-app-border rounded-xl text-xs text-app-text outline-none focus:border-primary placeholder:text-app-muted/50"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ---------- Recomendaciones ---------- */
function Recommendations() {
  const { items, addItem, favorites } = useCart()
  const inCart = new Set(items.map((i) => i.id))
  const recs = products
    .filter((p) => !inCart.has(p.id))
    .sort((a, b) => {
      const favA = favorites.includes(a.id) ? 1 : 0
      const favB = favorites.includes(b.id) ? 1 : 0
      if (favA !== favB) return favB - favA
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
    })
    .slice(0, 4)

  if (!recs.length) return null

  return (
    <div className="mt-4 mb-2">
      <p className="font-bold text-app-text text-sm mb-2.5">También te puede gustar</p>
      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
        {recs.map((p) => (
          <div key={p.id} className="flex-shrink-0 w-[130px] bg-white rounded-2xl p-3 shadow-card">
            <div
              className="w-full h-14 rounded-xl flex items-center justify-center text-3xl mb-2 relative"
              style={{ background: `linear-gradient(135deg, ${p.colors.from}22, ${p.colors.to}22)` }}
            >
              {p.emoji}
              {p.popular && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 rounded-full p-1">
                  <Star size={9} className="text-white fill-white" />
                </span>
              )}
            </div>
            <p className="font-bold text-app-text text-xs truncate">{p.name}</p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-primary font-black text-xs">${p.price}</span>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => addItem(p)}
                aria-label={`Agregar ${p.name} al carrito`}
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
              >
                <Plus size={15} className="text-white" />
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Cupón ---------- */
function CouponField() {
  const { coupon, applyCoupon, removeCoupon, discount } = useCart()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  if (coupon) {
    return (
      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 mb-3">
        <div className="flex items-center gap-2">
          <TicketPercent size={16} className="text-emerald-600" />
          <span className="text-emerald-700 text-xs font-bold">
            {coupon.code} aplicado (−${discount})
          </span>
        </div>
        <button onClick={removeCoupon} className="text-emerald-600">
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="mb-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <TicketPercent size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(false) }}
            placeholder="¿Tienes un cupón?"
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-app-border rounded-xl text-xs font-medium text-app-text outline-none focus:border-primary placeholder:text-app-muted/60 uppercase"
          />
        </div>
        <button
          onClick={() => { if (!applyCoupon(code)) setError(true) }}
          disabled={!code.trim()}
          className="px-4 py-2.5 bg-app-text text-white text-xs font-bold rounded-xl disabled:opacity-30"
        >
          Aplicar
        </button>
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1.5 ml-1">Cupón no válido</p>}
    </div>
  )
}

/* ---------- Barra de progreso para domicilio ---------- */
function DeliveryProgress({ subtotal }) {
  const falta = PEDIDO_MINIMO_DOMICILIO - subtotal
  const pct = Math.min(100, Math.round((subtotal / PEDIDO_MINIMO_DOMICILIO) * 100))

  return (
    <div className="bg-white rounded-2xl p-3.5 shadow-card mb-3">
      <div className="flex items-center gap-2 mb-2">
        <Bike size={15} className={falta > 0 ? 'text-app-muted' : 'text-emerald-500'} />
        <p className="text-xs font-semibold text-app-text">
          {falta > 0 ? (
            <>Te faltan <span className="text-primary font-black">${falta}</span> para pedir a domicilio</>
          ) : (
            <span className="text-emerald-600">¡Ya puedes pedir a domicilio! 🎉</span>
          )}
        </p>
      </div>
      <div className="h-2 bg-app-bg rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className={`h-full rounded-full ${falta > 0 ? 'bg-primary' : 'bg-emerald-500'}`}
        />
      </div>
    </div>
  )
}

/* ---------- Formulario de checkout ---------- */
function CheckoutForm({ onBack, onSubmit }) {
  const { total } = useCart()
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    entrega: 'pickup',
    zona: 'centro',
    direccion: '',
    referencias: '',
    pago: 'Efectivo',
    hora: '',
    observaciones: '',
  })
  const [error, setError] = useState('')

  const domicilioDisponible = total >= PEDIDO_MINIMO_DOMICILIO

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handlePhone = (v) => set('telefono', v.replace(/\D/g, '').slice(0, 10))

  const submit = () => {
    if (!form.nombre.trim()) return setError('Escribe tu nombre.')
    if (form.telefono.length < 10) return setError('El teléfono debe tener 10 dígitos.')
    if (form.entrega === 'domicilio' && !form.direccion.trim())
      return setError('Escribe tu dirección para la entrega.')
    setError('')
    onSubmit(form)
  }

  const inputCls =
    'w-full px-3.5 py-3 bg-white border-2 border-app-border rounded-xl text-sm text-app-text font-medium outline-none focus:border-primary transition-colors placeholder:text-app-muted/50'

  const envio =
    form.entrega === 'domicilio'
      ? form.zona === 'centro'
        ? ENVIO_ZONA_CENTRO
        : null // se cotiza
      : 0

  return (
    <div className="flex flex-col gap-3.5">
      {/* Nombre */}
      <div>
        <label className="block text-xs font-bold text-app-text mb-1.5">Tu nombre</label>
        <div className="relative">
          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => set('nombre', e.target.value)}
            placeholder="Ej. María García"
            className={`${inputCls} pl-10`}
          />
        </div>
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-xs font-bold text-app-text mb-1.5">Teléfono (WhatsApp)</label>
        <div className="relative">
          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted" />
          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-app-muted text-sm font-medium">+52</span>
          <input
            type="tel"
            inputMode="numeric"
            value={form.telefono}
            onChange={(e) => handlePhone(e.target.value)}
            placeholder="4431234567"
            maxLength={10}
            className={`${inputCls} pl-[70px]`}
          />
        </div>
      </div>

      {/* Tipo de entrega */}
      <div>
        <label className="block text-xs font-bold text-app-text mb-1.5">Tipo de entrega</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => set('entrega', 'pickup')}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-colors ${
              form.entrega === 'pickup' ? 'border-primary bg-primary-50' : 'border-app-border bg-white'
            }`}
          >
            <Store size={18} className={form.entrega === 'pickup' ? 'text-primary' : 'text-app-muted'} />
            <span className={`text-xs font-bold ${form.entrega === 'pickup' ? 'text-primary' : 'text-app-text'}`}>
              Recoger
            </span>
            <span className="text-[10px] text-app-muted">Plaza Alcasa, Local #1</span>
          </button>

          <button
            onClick={() => domicilioDisponible && set('entrega', 'domicilio')}
            disabled={!domicilioDisponible}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-colors ${
              form.entrega === 'domicilio'
                ? 'border-primary bg-primary-50'
                : 'border-app-border bg-white'
            } ${!domicilioDisponible ? 'opacity-45' : ''}`}
          >
            <Bike size={18} className={form.entrega === 'domicilio' ? 'text-primary' : 'text-app-muted'} />
            <span className={`text-xs font-bold ${form.entrega === 'domicilio' ? 'text-primary' : 'text-app-text'}`}>
              A domicilio
            </span>
            <span className="text-[10px] text-app-muted">Mínimo $100</span>
          </button>
        </div>
        {!domicilioDisponible && (
          <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 mt-2">
            {MENSAJE_MINIMO_DOMICILIO}
          </p>
        )}
      </div>

      {/* Datos de domicilio */}
      <AnimatePresence>
        {form.entrega === 'domicilio' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex flex-col gap-3.5"
          >
            {/* Zona */}
            <div>
              <label className="block text-xs font-bold text-app-text mb-1.5">Zona de entrega</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => set('zona', 'centro')}
                  className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-colors ${
                    form.zona === 'centro' ? 'border-primary bg-primary-50 text-primary' : 'border-app-border bg-white text-app-text'
                  }`}
                >
                  Zona Centro
                  <span className="block text-[10px] font-medium text-app-muted mt-0.5">Envío $25</span>
                </button>
                <button
                  onClick={() => set('zona', 'fuera')}
                  className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-colors ${
                    form.zona === 'fuera' ? 'border-primary bg-primary-50 text-primary' : 'border-app-border bg-white text-app-text'
                  }`}
                >
                  Fuera del Centro
                  <span className="block text-[10px] font-medium text-app-muted mt-0.5">Se cotiza</span>
                </button>
              </div>
              {form.zona === 'fuera' && (
                <p className="text-[11px] text-app-muted mt-1.5 ml-1">
                  El costo de envío será cotizado según la ubicación.
                </p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-xs font-bold text-app-text mb-1.5">Dirección</label>
              <textarea
                value={form.direccion}
                onChange={(e) => set('direccion', e.target.value)}
                placeholder="Calle, número, colonia..."
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Referencias */}
            <div>
              <label className="block text-xs font-bold text-app-text mb-1.5">
                Referencias <span className="font-normal text-app-muted">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.referencias}
                onChange={(e) => set('referencias', e.target.value)}
                placeholder="Ej. casa azul, frente al parque..."
                className={inputCls}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forma de pago */}
      <div>
        <label className="block text-xs font-bold text-app-text mb-1.5">Forma de pago</label>
        <div className="flex flex-col gap-2">
          {['Efectivo', 'Transferencia', ...(form.entrega === 'domicilio' ? ['Pago contra entrega'] : [])].map(
            (p) => (
              <button
                key={p}
                onClick={() => set('pago', p)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl border-2 transition-colors ${
                  form.pago === p ? 'border-primary bg-primary-50' : 'border-app-border bg-white'
                }`}
              >
                <span className={`text-xs font-bold ${form.pago === p ? 'text-primary' : 'text-app-text'}`}>
                  {p}
                </span>
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    form.pago === p ? 'border-primary' : 'border-app-border'
                  }`}
                >
                  {form.pago === p && <span className="w-2 h-2 rounded-full bg-primary" />}
                </span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Hora deseada */}
      <div>
        <label className="block text-xs font-bold text-app-text mb-1.5">
          Hora deseada <span className="font-normal text-app-muted">(opcional)</span>
        </label>
        <input
          type="time"
          value={form.hora}
          onChange={(e) => set('hora', e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-xs font-bold text-app-text mb-1.5">
          Observaciones <span className="font-normal text-app-muted">(opcional)</span>
        </label>
        <textarea
          value={form.observaciones}
          onChange={(e) => set('observaciones', e.target.value)}
          placeholder="Algo más que debamos saber..."
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Resumen de envío */}
      <div className="bg-white rounded-2xl p-3.5 shadow-card">
        <div className="flex justify-between text-xs text-app-muted mb-1">
          <span>Productos</span>
          <span>${total}</span>
        </div>
        <div className="flex justify-between text-xs text-app-muted mb-2">
          <span>Envío</span>
          <span>
            {form.entrega === 'pickup'
              ? 'Sin costo'
              : envio !== null
                ? `$${envio}`
                : 'Se cotizará'}
          </span>
        </div>
        <div className="h-px bg-app-border mb-2" />
        <div className="flex justify-between font-black text-app-text text-sm">
          <span>Total</span>
          <span className="text-primary">
            ${envio !== null ? total + envio : total}
            {envio === null && <span className="text-[10px] font-medium text-app-muted"> + envío</span>}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
          <AlertTriangle size={14} className="flex-shrink-0" />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-2.5 pb-1">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl border-2 border-app-border bg-white text-app-text font-bold text-sm"
        >
          <ArrowLeft size={16} />
          Volver
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-fab"
        >
          <Send size={16} />
          Enviar pedido
        </motion.button>
      </div>
    </div>
  )
}

/* ---------- Modal de confirmación ---------- */
function ConfirmModal({ onCancel, onConfirm }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center px-5 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.85, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 24 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 w-full max-w-[400px] max-h-[85dvh] overflow-y-auto"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-amber-500" />
        </div>
        <h3 className="font-black text-app-text text-lg mb-3">Importante</h3>
        <div className="text-app-muted text-sm leading-relaxed flex flex-col gap-2.5 mb-5">
          <p>
            Al presionar <strong className="text-app-text">"Enviar pedido por WhatsApp"</strong>,
            únicamente se enviará una <strong className="text-app-text">solicitud de pedido</strong>.
          </p>
          <p className="font-bold text-app-text">Tu pedido NO quedará confirmado automáticamente.</p>
          <p>
            Será necesario esperar a que un miembro de nuestro equipo revise la disponibilidad de
            los productos, confirme el costo de envío (si aplica) y responda tu mensaje.
          </p>
          <p>
            <strong className="text-app-text">
              Tu pedido quedará confirmado únicamente cuando recibas nuestra confirmación por WhatsApp.
            </strong>
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm mb-2"
        >
          <Send size={16} />
          Entendido, enviar por WhatsApp
        </motion.button>
        <button onClick={onCancel} className="w-full py-2.5 text-app-muted font-semibold text-xs">
          Regresar
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Drawer principal ---------- */
export default function CartDrawer() {
  const cart = useCart()
  const [step, setStep] = useState('cart') // cart | checkout | sent
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingForm, setPendingForm] = useState(null)

  if (!cart) return null
  const {
    items, itemCount, subtotal, discount, coupon, total,
    clearCart, drawerOpen, setDrawerOpen,
  } = cart

  const close = () => {
    setDrawerOpen(false)
    setTimeout(() => setStep('cart'), 300)
  }

  const handleCheckoutSubmit = (form) => {
    setPendingForm(form)
    setShowConfirm(true)
  }

  const handleConfirmSend = () => {
    const msg = buildCartMessage({
      items, subtotal, discount, coupon, total,
      cliente: pendingForm,
    })
    window.open(getWhatsAppURL(msg), '_blank', 'noopener,noreferrer')
    setShowConfirm(false)
    clearCart()
    setStep('sent')
  }

  return (
    <>
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[70] bg-app-bg rounded-t-3xl flex flex-col"
              style={{ maxHeight: '92dvh' }}
            >
              {/* Handle + header */}
              <div className="flex-shrink-0 pt-3 pb-2 px-5">
                <div className="w-10 h-1 bg-app-border rounded-full mx-auto mb-3" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                      <ShoppingBag size={18} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="font-black text-app-text text-base leading-tight">
                        {step === 'cart' && 'Tu carrito'}
                        {step === 'checkout' && 'Datos de entrega'}
                        {step === 'sent' && 'Solicitud enviada'}
                      </h2>
                      {step === 'cart' && itemCount > 0 && (
                        <p className="text-app-muted text-xs">{itemCount} artículo{itemCount !== 1 ? 's' : ''}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {step === 'cart' && items.length > 0 && (
                      <button
                        onClick={() => { if (window.confirm('¿Vaciar el carrito?')) clearCart() }}
                        className="w-9 h-9 rounded-xl bg-white shadow-card flex items-center justify-center"
                        aria-label="Vaciar carrito"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    )}
                    <button
                      onClick={close}
                      className="w-9 h-9 rounded-xl bg-white shadow-card flex items-center justify-center"
                      aria-label="Cerrar"
                    >
                      <X size={16} className="text-app-text" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenido scrolleable */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
                {/* PASO: carrito */}
                {step === 'cart' && (
                  items.length === 0 ? (
                    <div className="text-center py-14">
                      <span className="text-6xl">🛒</span>
                      <p className="font-bold text-app-text mt-4 mb-1">Tu carrito está vacío</p>
                      <p className="text-app-muted text-sm mb-6">Agrega tus Toppis favoritos</p>
                      <button
                        onClick={close}
                        className="bg-primary text-white font-bold text-sm px-6 py-3 rounded-2xl"
                      >
                        Ver productos
                      </button>
                    </div>
                  ) : (
                    <>
                      <DeliveryProgress subtotal={total} />

                      <AnimatePresence>
                        {items.map((item) => (
                          <CartItem key={item.id} item={item} />
                        ))}
                      </AnimatePresence>

                      <Recommendations />
                      <CouponField />

                      {/* Totales */}
                      <div className="bg-white rounded-2xl p-4 shadow-card">
                        <div className="flex justify-between text-xs text-app-muted mb-1.5">
                          <span>Subtotal</span>
                          <span>${subtotal}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-xs text-emerald-600 mb-1.5">
                            <span>Descuento ({coupon.code})</span>
                            <span>−${discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs text-app-muted mb-2">
                          <span>Envío</span>
                          <span>Según tipo de entrega</span>
                        </div>
                        <div className="h-px bg-app-border mb-2" />
                        <div className="flex justify-between items-center">
                          <span className="font-black text-app-text text-base">Total</span>
                          <motion.span key={total} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="font-black text-primary text-xl">
                            ${total}
                          </motion.span>
                        </div>
                      </div>
                    </>
                  )
                )}

                {/* PASO: checkout */}
                {step === 'checkout' && (
                  <CheckoutForm onBack={() => setStep('cart')} onSubmit={handleCheckoutSubmit} />
                )}

                {/* PASO: enviado */}
                {step === 'sent' && (
                  <div className="text-center py-10 px-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                      className="text-6xl mb-4"
                    >
                      📨
                    </motion.div>
                    <div className="flex justify-center mb-4">
                      <CheckCircle2 size={38} className="text-emerald-500" />
                    </div>
                    <h3 className="font-black text-app-text text-lg mb-2">¡Solicitud enviada!</h3>
                    <p className="text-app-muted text-sm leading-relaxed mb-2">
                      Tu solicitud de pedido se envió por WhatsApp.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-left mb-6">
                      <p className="text-amber-700 text-xs leading-relaxed font-medium">
                        ⏳ Recuerda: tu pedido quedará <strong>confirmado únicamente</strong> cuando
                        nuestro equipo te responda por WhatsApp confirmando disponibilidad y costo
                        de envío (si aplica).
                      </p>
                    </div>
                    <button
                      onClick={close}
                      className="bg-primary text-white font-bold text-sm px-8 py-3.5 rounded-2xl"
                    >
                      Entendido
                    </button>
                  </div>
                )}
              </div>

              {/* Footer fijo (solo en paso carrito con items) */}
              {step === 'cart' && items.length > 0 && (
                <div
                  className="flex-shrink-0 px-4 pt-3 pb-4 bg-app-bg border-t border-app-border flex gap-2.5"
                  style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
                >
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={close}
                    className="px-4 py-3.5 rounded-2xl border-2 border-app-border bg-white text-app-text font-bold text-sm"
                  >
                    Seguir comprando
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep('checkout')}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-fab"
                  >
                    Finalizar pedido · ${total}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de confirmación */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal onCancel={() => setShowConfirm(false)} onConfirm={handleConfirmSend} />
        )}
      </AnimatePresence>
    </>
  )
}
