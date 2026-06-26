'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Download, Trophy, Phone, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils/formatDate'

export default function AdminDinamicas() {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [winner, setWinner] = useState(null)
  const [apiKey] = useState(() =>
    typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('admin_key') || '' : '',
  )

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/cupones?key=${encodeURIComponent(apiKey)}`)
      if (res.ok) {
        const data = await res.json()
        setParticipants(data.cupones || [])
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const pickWinner = () => {
    if (!participants.length) return
    const idx = Math.floor(Math.random() * participants.length)
    setWinner(participants[idx])
  }

  const exportCSV = () => {
    const rows = [
      ['Nombre', 'Teléfono', 'Fecha'],
      ...participants.map((p) => [p.nombre, p.telefono, p.createdAt || '']),
    ]
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `participantes-${Date.now()}.csv`
    a.click()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-app-text">Clientes 👥</h1>
          <p className="text-app-muted text-xs">{participants.length} participantes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData}
            className="w-10 h-10 rounded-2xl bg-white shadow-card flex items-center justify-center">
            <RefreshCw size={18} className={`text-app-muted ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={exportCSV}
            className="w-10 h-10 rounded-2xl bg-white shadow-card flex items-center justify-center">
            <Download size={18} className="text-app-muted" />
          </button>
        </div>
      </div>

      {/* Winner picker */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-black text-base">Sorteo</p>
            {winner ? (
              <div className="mt-1">
                <p className="text-white text-sm font-bold">{winner.nombre}</p>
                <p className="text-white/80 text-xs">+52 {winner.telefono}</p>
              </div>
            ) : (
              <p className="text-white/80 text-sm">Elige un ganador al azar</p>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={pickWinner}
            disabled={!participants.length}
            className="flex items-center gap-2 bg-white text-amber-600 font-bold text-sm px-4 py-2.5 rounded-xl disabled:opacity-50"
          >
            <Trophy size={16} /> {winner ? 'Nuevo sorteo' : 'Sortear'}
          </motion.button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="font-bold text-sm text-app-text">Lista de participantes</p>
          <p className="text-xs text-app-muted">{participants.length} total</p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-app-muted text-sm">Cargando…</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-app-muted text-sm">Aún no hay participantes</p>
            <p className="text-xs text-app-muted mt-1">Configura Firebase en .env.local para ver datos reales</p>
          </div>
        ) : (
          participants.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${winner?.id === p.id ? 'bg-amber-50' : ''}`}
            >
              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-black text-primary">
                  {p.nombre?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-app-text text-sm truncate">
                  {p.nombre}
                  {winner?.id === p.id && <span className="ml-2 text-amber-500">🏆</span>}
                </p>
                <p className="text-app-muted text-xs flex items-center gap-1">
                  <Phone size={10} /> +52 {p.telefono}
                </p>
              </div>
              <p className="text-app-muted text-xs text-right flex-shrink-0">
                {p.createdAt ? formatDateTime(p.createdAt) : '—'}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
