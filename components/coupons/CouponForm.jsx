'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { User, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { addParticipante } from '@/lib/utils/participantes'

export default function CouponForm() {
  const [form, setForm] = useState({ nombre: '', telefono: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'telefono') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10)
      setForm((prev) => ({ ...prev, telefono: cleaned }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || form.telefono.length < 10) {
      setError('Por favor completa todos los campos correctamente.')
      return
    }
    setError('')
    setStatus('loading')

    try {
      // Guarda el registro localmente (sin backend).
      addParticipante({ nombre: form.nombre.trim(), telefono: form.telefono })
      // Pequeña pausa para que se vea el estado de carga.
      await new Promise((r) => setTimeout(r, 400))
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError('No se pudo guardar tu registro. Intenta de nuevo.')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h3 className="text-xl font-black text-app-text mb-2">¡Gracias por participar! 🎉</h3>
        <p className="text-app-muted text-sm mb-1">
          <strong className="text-app-text">{form.nombre}</strong>, tu registro fue exitoso.
        </p>
        <p className="text-app-muted text-sm">
          Te avisaremos al número <strong className="text-app-text">{form.telefono}</strong> si eres el ganador. 🍓
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setStatus('idle'); setForm({ nombre: '', telefono: '' }) }}
          className="mt-6 text-primary font-semibold text-sm underline underline-offset-2"
        >
          Registrar otra persona
        </motion.button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-semibold text-app-text mb-2">
          Tu nombre completo
        </label>
        <div className="relative">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" />
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. María García"
            required
            autoComplete="name"
            className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-app-border rounded-2xl text-app-text font-medium text-sm outline-none focus:border-primary transition-colors placeholder:text-app-muted/60"
          />
        </div>
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-semibold text-app-text mb-2">
          Número de WhatsApp
        </label>
        <div className="relative">
          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" />
          <div className="absolute left-11 top-1/2 -translate-y-1/2 text-app-muted text-sm font-medium">
            +52
          </div>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="4611234567"
            maxLength={10}
            required
            inputMode="numeric"
            autoComplete="tel"
            className="w-full pl-[72px] pr-4 py-3.5 bg-white border-2 border-app-border rounded-2xl text-app-text font-medium text-sm outline-none focus:border-primary transition-colors placeholder:text-app-muted/60"
          />
          {form.telefono.length > 0 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-app-muted">
              {form.telefono.length}/10
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {(error || status === 'error') && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5"
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <Button
        type="submit"
        size="full"
        loading={status === 'loading'}
        icon={<Send size={18} />}
      >
        Participar ahora
      </Button>

      <p className="text-center text-xs text-app-muted">
        Al participar aceptas ser contactado por WhatsApp si ganas 🏆
      </p>
    </form>
  )
}
