'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  RefreshCw, Download, Trophy, Phone, Plus, Lock, MessageCircle, AlertCircle,
} from 'lucide-react'
import { formatDateTime, formatDate } from '@/lib/utils/formatDate'
import { descargarParticipantesCSV } from '@/lib/utils/participantes'

const API = '/admin/api/dinamicas'

export default function AdminDinamicas() {
  const [sorteos, setSorteos] = useState([])
  const [sorteo, setSorteo] = useState(null)
  const [participantes, setParticipantes] = useState([])
  const [ganador, setGanador] = useState(null)

  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [nuevo, setNuevo] = useState({ premio: '', descripcion: '', cierra_en: '' })

  const cargar = useCallback(async (id) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(id ? `${API}?sorteo=${id}` : API, { cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudieron cargar los datos.')

      setSorteos(data.sorteos || [])
      setSorteo(data.sorteo || null)
      setParticipantes(data.participantes || [])
      setGanador(data.ganador || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const accion = async (payload, onOk) => {
    setWorking(true)
    setError('')
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudo completar la acción.')
      await onOk?.(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setWorking(false)
    }
  }

  const crearSorteo = (e) => {
    e.preventDefault()
    accion({ accion: 'crear', ...nuevo }, async (data) => {
      setNuevo({ premio: '', descripcion: '', cierra_en: '' })
      await cargar(data.sorteo.id)
    })
  }

  const sortear = () => {
    if (!window.confirm('¿Elegir un ganador al azar? Quedará guardado con la fecha de hoy.')) return
    accion({ accion: 'sortear', sorteo_id: sorteo.id }, () => cargar(sorteo.id))
  }

  const cerrarMes = () => {
    if (!window.confirm('¿Cerrar este sorteo? Ya no se aceptarán registros nuevos, pero la lista y el ganador se conservan.')) return
    accion({ accion: 'cerrar', sorteo_id: sorteo.id }, () => cargar(sorteo.id))
  }

  const avisarGanador = () => {
    const msg = `¡Felicidades ${ganador.nombre}! 🎉🍓\n\nGanaste el sorteo de Toppifresa: *${sorteo.premio}*.\n\nPasa a la sucursal a reclamar tu premio mostrando este mensaje. ¡Te esperamos!`
    window.open(
      `https://wa.me/52${ganador.telefono}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const abierto = sorteo?.estado === 'abierto'

  return (
    <div>
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-app-text">Dinámicas 🎉</h1>
          <p className="text-app-muted text-xs">{participantes.length} participantes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => cargar(sorteo?.id)} aria-label="Actualizar"
            className="w-10 h-10 rounded-2xl bg-white shadow-card flex items-center justify-center">
            <RefreshCw size={18} className={`text-app-muted ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => descargarParticipantesCSV(participantes, sorteo?.premio)}
            disabled={!participantes.length}
            aria-label="Descargar Excel"
            className="w-10 h-10 rounded-2xl bg-white shadow-card flex items-center justify-center disabled:opacity-40">
            <Download size={18} className="text-app-muted" />
          </button>
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-xs leading-relaxed">{error}</p>
        </div>
      )}

      {/* Selector de sorteos: el historial completo, mes por mes */}
      {sorteos.length > 0 && (
        <div className="mb-5">
          <label htmlFor="sorteo" className="block text-xs font-semibold text-app-muted mb-1.5">
            Sorteo
          </label>
          <select
            id="sorteo"
            value={sorteo?.id || ''}
            onChange={(e) => cargar(e.target.value)}
            className="w-full px-4 py-3 bg-white shadow-card rounded-2xl text-sm font-medium text-app-text outline-none"
          >
            {sorteos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.premio} — {formatDate(s.created_at)}
                {s.estado === 'abierto' ? ' (abierto)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Crear el sorteo del mes */}
      {!loading && !sorteos.some((s) => s.estado === 'abierto') && (
        <form onSubmit={crearSorteo} className="bg-white rounded-2xl shadow-card p-4 mb-5">
          <p className="font-bold text-sm text-app-text mb-1">Abrir el sorteo del mes</p>
          <p className="text-app-muted text-xs mb-4">
            Lo que escribas aquí es lo que verán las clientas en la página de Dinámicas.
          </p>
          <div className="flex flex-col gap-3">
            <input
              value={nuevo.premio}
              onChange={(e) => setNuevo({ ...nuevo, premio: e.target.value })}
              placeholder="Premio. Ej. 1 Toppi Grande"
              required
              className="w-full px-4 py-3 bg-app-bg border-2 border-app-border rounded-2xl text-sm outline-none focus:border-primary"
            />
            <input
              value={nuevo.descripcion}
              onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
              placeholder="Detalle. Ej. de tu elección + toppings premium"
              className="w-full px-4 py-3 bg-app-bg border-2 border-app-border rounded-2xl text-sm outline-none focus:border-primary"
            />
            <label className="text-xs text-app-muted">
              Cierra el (opcional)
              <input
                type="date"
                value={nuevo.cierra_en}
                onChange={(e) => setNuevo({ ...nuevo, cierra_en: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-app-bg border-2 border-app-border rounded-2xl text-sm text-app-text outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              disabled={working}
              className="flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm py-3 rounded-2xl disabled:opacity-50"
            >
              <Plus size={16} /> Abrir sorteo
            </button>
          </div>
        </form>
      )}

      {/* Sorteo y ganador */}
      {sorteo && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 mb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-white font-black text-base">{sorteo.premio}</p>
              <p className="text-white/70 text-xs">
                {abierto ? 'Abierto · aceptando registros' : 'Cerrado'}
                {sorteo.cierra_en && abierto && ` · cierra ${formatDate(sorteo.cierra_en)}`}
              </p>

              {ganador ? (
                <div className="mt-3 bg-white/20 rounded-xl px-3 py-2">
                  <p className="text-white text-sm font-bold">🏆 {ganador.nombre}</p>
                  <p className="text-white/80 text-xs">+52 {ganador.telefono}</p>
                  <p className="text-white/60 text-[11px] mt-0.5">
                    Sorteado el {formatDateTime(sorteo.sorteado_en)}
                  </p>
                </div>
              ) : (
                <p className="text-white/80 text-sm mt-2">Aún sin ganador</p>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={sortear}
                disabled={!participantes.length || working}
                className="flex items-center gap-2 bg-white text-amber-600 font-bold text-sm px-4 py-2.5 rounded-xl disabled:opacity-50"
              >
                <Trophy size={16} /> {ganador ? 'Re-sortear' : 'Sortear'}
              </motion.button>

              {ganador && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={avisarGanador}
                  className="flex items-center gap-2 bg-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl"
                >
                  <MessageCircle size={16} /> Avisar
                </motion.button>
              )}

              {abierto && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={cerrarMes}
                  disabled={working}
                  className="flex items-center gap-2 bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl disabled:opacity-50"
                >
                  <Lock size={16} /> Cerrar
                </motion.button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="font-bold text-sm text-app-text">Lista de participantes</p>
          <p className="text-xs text-app-muted">{participantes.length} total</p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-app-muted text-sm">Cargando…</p>
          </div>
        ) : participantes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-app-muted text-sm">Todavía no hay participantes</p>
            <p className="text-xs text-app-muted mt-1">
              Los registros del formulario aparecerán aquí
            </p>
          </div>
        ) : (
          participantes.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i, 15) * 0.03 }}
              className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${ganador?.id === p.id ? 'bg-amber-50' : ''}`}
            >
              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-black text-primary">
                  {p.nombre?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-app-text text-sm truncate">
                  {p.nombre}
                  {ganador?.id === p.id && <span className="ml-2 text-amber-500">🏆</span>}
                </p>
                <p className="text-app-muted text-xs flex items-center gap-1">
                  <Phone size={10} /> +52 {p.telefono}
                </p>
              </div>
              <p className="text-app-muted text-xs text-right flex-shrink-0">
                {formatDateTime(p.created_at)}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
