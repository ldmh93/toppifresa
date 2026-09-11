'use client'

import { Clock, Info, MapPin, Phone, Truck, Instagram, FileCode2 } from 'lucide-react'
import {
  HORARIO_DISPLAY,
  HORARIO_SEMANAL,
  INTERVALO_MINUTOS,
  MENSAJE_CERRADO,
} from '@/lib/data/horarios'
import { PEDIDO_MINIMO_DOMICILIO, ENVIO_ZONA_CENTRO } from '@/lib/cart/config'

// Esta página muestra la configuración REAL que está usando la app en este
// momento y dice exactamente dónde se cambia cada dato.
//
// Antes tenía formularios que guardaban en localStorage y un mensaje que
// prometía sincronizar con Firebase. Nada de eso llegaba a los clientes: los
// valores de verdad viven en archivos de código y en variables de entorno.
// Un panel que finge guardar es peor que uno que no guarda, porque te hace
// creer que ya cambiaste algo.

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

function Seccion({ title, icon: Icon, fuente, children }) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
        <Icon size={16} className="flex-shrink-0 text-primary" />
        <p className="flex-1 text-sm font-bold text-app-text">{title}</p>
      </div>
      <div className="flex flex-col gap-3 p-4">{children}</div>
      <div className="flex items-center gap-1.5 border-t border-gray-100 bg-gray-50 px-4 py-2">
        <FileCode2 size={12} className="flex-shrink-0 text-gray-400" />
        <p className="font-mono text-[11px] text-gray-500">{fuente}</p>
      </div>
    </div>
  )
}

function Dato({ label, valor, nota }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-app-text">{valor}</p>
      {nota && <p className="mt-0.5 text-[11px] leading-relaxed text-app-muted">{nota}</p>}
    </div>
  )
}

export default function AdminConfig() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '524439425620'
  const diasAbiertos = Object.keys(HORARIO_SEMANAL).map(Number)

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-xl font-black text-app-text">Configuración ⚙️</h1>
        <p className="text-xs text-app-muted">Lo que la app está usando ahora mismo</p>
      </div>

      <div className="mb-4 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3">
        <div className="flex items-start gap-2">
          <Info size={15} className="mt-0.5 flex-shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-primary-800">
            Esta pantalla es de <strong>solo lectura</strong>. Cada tarjeta indica abajo el archivo
            donde se cambia el dato. Se edita ahí, se publica y la app se actualiza sola.
          </p>
        </div>
      </div>

      <Seccion title="WhatsApp del negocio" icon={Phone} fuente="Variable de entorno NEXT_PUBLIC_WHATSAPP_NUMBER">
        <Dato
          label="Número"
          valor={`+${whatsapp}`}
          nota="Se define en .env.local para pruebas locales y en el panel de Vercel para producción. Es público por diseño: viaja en el enlace de cada pedido."
        />
      </Seccion>

      <Seccion title="Horario de atención" icon={Clock} fuente="lib/data/horarios.js">
        {HORARIO_DISPLAY.map((h) => (
          <Dato key={h.day} label={h.day} valor={h.hours} />
        ))}
        <Dato
          label="Días cerrados"
          valor={DIAS.filter((_, i) => !diasAbiertos.includes(i)).join(', ')}
        />
        <Dato
          label="Intervalo de entrega"
          valor={`Cada ${INTERVALO_MINUTOS} minutos`}
          nota="Define los horarios que el cliente puede elegir en el checkout."
        />
        <Dato label="Mensaje fuera de horario" valor={MENSAJE_CERRADO} />
      </Seccion>

      <Seccion title="Entregas a domicilio" icon={Truck} fuente="lib/cart/config.js">
        <Dato
          label="Pedido mínimo"
          valor={`$${PEDIDO_MINIMO_DOMICILIO}`}
          nota="Por debajo de este total, el checkout solo permite recoger en el local."
        />
        <Dato label="Envío Zona Centro" valor={`$${ENVIO_ZONA_CENTRO}`} />
        <Dato label="Fuera de Zona Centro" valor="Se cotiza según la ubicación" />
      </Seccion>

      <Seccion title="Dirección" icon={MapPin} fuente="app/layout.jsx (JSON-LD) y app/(app)/ubicacion/page.jsx">
        <Dato label="Local" valor="Plaza Alcasa (Cinepolis), Local #1" />
        <Dato label="Ciudad" valor="Acámbaro, Guanajuato, México" />
      </Seccion>

      <Seccion title="Redes sociales" icon={Instagram} fuente="app/(app)/ubicacion/page.jsx">
        <Dato label="Instagram" valor="@toppifresa" />
      </Seccion>
    </div>
  )
}
