"use client"
import { useState, useEffect } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function AdminPage() {
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const q = query(collection(db, "dinamicas"), orderBy("fecha", "desc"))
        const snap = await getDocs(q)
        setRegistros(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-2xl">🍓</span>
          <h1 className="text-xl font-black text-gray-800">Panel Toppifresa</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-gray-700">Participantes en dinamicas</h2>
            <span className="bg-pink-100 text-pink-600 text-xs font-black px-2.5 py-1 rounded-full">
              {registros.length} registros
            </span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
          ) : registros.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Sin registros aun</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {registros.map((r) => (
                <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{r.nombre}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{r.telefono}</p>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {r.fecha?.toDate?.()?.toLocaleDateString("es-MX") ?? "Pendiente"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
