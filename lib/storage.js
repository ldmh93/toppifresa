const KEYS = {
  clientes: "nail_clientes",
  citas:    "nail_citas",
  ventas:   "nail_ventas",
}

function safeRead(key) {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(key) ?? "[]") }
  catch { return [] }
}

function safeWrite(key, value) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export const getClientes  = () => safeRead(KEYS.clientes)
export const saveClientes = (v) => safeWrite(KEYS.clientes, v)

export const getCitas  = () => safeRead(KEYS.citas)
export const saveCitas = (v) => safeWrite(KEYS.citas, v)

export const getVentas  = () => safeRead(KEYS.ventas)
export const saveVentas = (v) => safeWrite(KEYS.ventas, v)

export function seedDemoData() {
  if (typeof window === "undefined") return

  if (getClientes().length === 0) {
    saveClientes([
      {
        id: "demo-1",
        nombre: "María García",
        telefono: "5512345678",
        ultimaVisita: new Date().toISOString().split("T")[0],
        notas: "Le gustan las uñas largas con diseños florales. Sin alergias conocidas.",
        historial: ["Full Set - Coffin - Chrome", "Retoque - Marble"],
      },
      {
        id: "demo-2",
        nombre: "Ana López",
        telefono: "5598765432",
        ultimaVisita: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
        notas: "Alérgica al acrílico. Prefiere gel.",
        historial: ["Gel - Almendra - Cat Eye", "Retoque - Ombré"],
      },
      {
        id: "demo-3",
        nombre: "Sofía Martínez",
        telefono: "5567891234",
        ultimaVisita: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        notas: "Prefiere diseños minimalistas y colores nude.",
        historial: ["Full Set - Cuadrada", "Gel - Almendra"],
      },
    ])
  }

  if (getCitas().length === 0) {
    const today = new Date().toISOString().split("T")[0]
    saveCitas([
      { id: "c1", cliente: "María García",   servicio: "Full Set", fecha: today, hora: "10:00", estado: "confirmada" },
      { id: "c2", cliente: "Ana López",      servicio: "Retoque",  fecha: today, hora: "12:00", estado: "pendiente"  },
      { id: "c3", cliente: "Sofía Martínez", servicio: "Gel",      fecha: today, hora: "14:30", estado: "confirmada" },
    ])
  }

  if (getVentas().length === 0) {
    const d = (n) => new Date(Date.now() - n * 86400000).toISOString().split("T")[0]
    saveVentas([
      { id: "v1", fecha: d(0), servicio: "Full Set", monto: 450, cliente: "María García"   },
      { id: "v2", fecha: d(0), servicio: "Retoque",  monto: 250, cliente: "Ana López"      },
      { id: "v3", fecha: d(0), servicio: "Gel",      monto: 350, cliente: "Sofía Martínez" },
      { id: "v4", fecha: d(1), servicio: "Full Set", monto: 500, cliente: "Laura Ruiz"     },
      { id: "v5", fecha: d(2), servicio: "Acrílico", monto: 380, cliente: "Carmen Soto"    },
      { id: "v6", fecha: d(3), servicio: "Gel",      monto: 310, cliente: "Paola Ramírez"  },
      { id: "v7", fecha: d(5), servicio: "Full Set", monto: 470, cliente: "Daniela Cruz"   },
    ])
  }
}
