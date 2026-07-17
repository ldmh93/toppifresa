'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Phone, MapPin, Clock, Instagram, Info, Check } from 'lucide-react'

const DEFAULT_CONFIG = {
  whatsapp: '524439425620',
  businessName: 'Toppifresa',
  address: 'Plaza Alcasa (Cinepolis), Local #1, Acámbaro, Guanajuato',
  addressDetail: '',
  instagram: '@toppifresa',
  schedule: [
    { day: 'Sábado', hours: '5:00 PM – 10:00 PM', open: true },
    { day: 'Domingo', hours: '5:00 PM – 10:00 PM', open: true },
  ],
  deliveryEnabled: true,
  deliveryNote: 'Entregas a domicilio en pedidos de $100 o más. Zona Centro $25; fuera de zona se cotiza.',
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <Icon size={16} className="text-primary" />
        <p className="font-bold text-sm text-app-text">{title}</p>
      </div>
      <div className="p-4 flex flex-col gap-3">{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

export default function AdminConfig() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [saved, setSaved] = useState(false)

  const set = (key, val) => setConfig((c) => ({ ...c, [key]: val }))

  const updateSchedule = (i, data) => {
    const s = [...config.schedule]
    s[i] = { ...s[i], ...data }
    set('schedule', s)
  }

  const handleSave = () => {
    // Save to localStorage for demo; replace with Firebase when ready
    localStorage.setItem('toppifresa_config', JSON.stringify(config))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-black text-app-text">Configuración ⚙️</h1>
        <p className="text-app-muted text-xs">Datos de tu negocio visibles en la app</p>
      </div>

      {/* WhatsApp */}
      <Section title="WhatsApp" icon={Phone}>
        <Field label="Número de WhatsApp">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
            <span className="text-gray-500 text-sm font-medium">+</span>
            <input
              value={config.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 15))}
              placeholder="524611234567"
              className="flex-1 text-sm bg-transparent outline-none text-app-text"
              inputMode="numeric"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Incluye código de país (52 para México)</p>
        </Field>
      </Section>

      {/* Info */}
      <Section title="Información del negocio" icon={Info}>
        <Field label="Nombre del negocio">
          <input value={config.businessName} onChange={(e) => set('businessName', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary" />
        </Field>
        <Field label="Instagram">
          <input value={config.instagram} onChange={(e) => set('instagram', e.target.value)}
            placeholder="@toppifresa"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary" />
        </Field>
      </Section>

      {/* Location */}
      <Section title="Ubicación" icon={MapPin}>
        <Field label="Dirección">
          <input value={config.address} onChange={(e) => set('address', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary" />
        </Field>
        <Field label="Referencia / detalle">
          <input value={config.addressDetail} onChange={(e) => set('addressDetail', e.target.value)}
            placeholder="Ej: Frente al parque central"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary" />
        </Field>
        <Field label="¿Hacen entregas a domicilio?">
          <div className="flex items-center gap-3">
            {[true, false].map((v) => (
              <button key={String(v)} onClick={() => set('deliveryEnabled', v)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${config.deliveryEnabled === v ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                {v ? 'Sí ✅' : 'No ❌'}
              </button>
            ))}
          </div>
          {config.deliveryEnabled && (
            <textarea value={config.deliveryNote} onChange={(e) => set('deliveryNote', e.target.value)}
              rows={2} placeholder="Nota sobre entregas..."
              className="w-full mt-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary resize-none" />
          )}
        </Field>
      </Section>

      {/* Schedule */}
      <Section title="Horarios" icon={Clock}>
        {config.schedule.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <button
              onClick={() => updateSchedule(i, { open: !s.open })}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${s.open ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
            >
              {s.open ? '✓' : '✗'}
            </button>
            <div className="flex-1">
              <p className="text-xs font-semibold text-app-text">{s.day}</p>
              <input
                value={s.hours}
                onChange={(e) => updateSchedule(i, { hours: e.target.value })}
                disabled={!s.open}
                className="text-xs text-app-muted bg-transparent outline-none w-full disabled:opacity-50"
              />
            </div>
          </div>
        ))}
      </Section>

      {/* Save */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-300"
        style={{ background: saved ? '#25D366' : 'linear-gradient(135deg, #D63864, #9B1C40)', color: '#fff' }}
      >
        {saved ? <><Check size={20} /> ¡Guardado!</> : <><Save size={20} /> Guardar cambios</>}
      </motion.button>

      <p className="text-center text-xs text-app-muted mt-3 px-4">
        💡 Conecta Firebase para sincronizar estos cambios en la app en tiempo real.
      </p>
    </div>
  )
}
