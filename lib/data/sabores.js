// 🍨 SABORES BASE
//
// Un "sabor" es lo que se mezcla con las fresas y la crema (Oreo, avellana,
// mazapán…). Hoy el negocio los vende como productos independientes: el
// ToppiOreo ya viene con Oreo, el ToppiAvellana con avellana, etc.
//
// Este catálogo existe para el caso en que quieras venderlos como una opción
// dentro de un mismo producto ("elige tu sabor") sin volver a tocar el código.
// Se activa poniendo IDs de aquí en el campo `sabores` de un producto en
// products.js. Mientras ese campo esté vacío, el cliente no ve ningún
// selector y el menú funciona exactamente igual que hoy.
//
// Campos:
//   id           Identificador único, estable.
//   nombre       Como se le muestra al cliente.
//   emoji        Icono corto.
//   precioExtra  Pesos que se suman al precio del producto. 0 = sin costo.
//   activo       false lo esconde sin borrarlo.
//   orden        Posición en la lista, de menor a mayor.

// ⬇️ INICIO DATOS — generado por /admin, reemplaza hasta FIN DATOS
export const sabores = [
  { id: 'oreo', nombre: 'Oreo triturado', emoji: '🍪', precioExtra: 10, activo: true, orden: 1 },
  { id: 'avellana', nombre: 'Crema de avellana', emoji: '🌰', precioExtra: 10, activo: true, orden: 2 },
  { id: 'bubulubu', nombre: 'Bubulubu en trocitos', emoji: '🍫', precioExtra: 10, activo: true, orden: 3 },
  { id: 'mazapan', nombre: 'Mazapán De La Rosa', emoji: '🌸', precioExtra: 10, activo: true, orden: 4 },
  { id: 'durazno', nombre: 'Durazno', emoji: '🍑', precioExtra: 15, activo: true, orden: 5 },
  { id: 'chamoy', nombre: 'Chamoy', emoji: '🌶️', precioExtra: 10, activo: true, orden: 6 },
]
// ⬆️ FIN DATOS

/* ---------- Helpers ---------- */

/** Sabores visibles para el cliente, ya ordenados. */
export const getSaboresActivos = () =>
  sabores.filter((s) => s.activo).sort((a, b) => a.orden - b.orden)

export const getSaborById = (id) => sabores.find((s) => s.id === id)

/** Resuelve los sabores que ofrece un producto concreto. */
export const getSaboresDeProducto = (producto) =>
  (producto?.sabores ?? [])
    .map(getSaborById)
    .filter((s) => s && s.activo)
    .sort((a, b) => a.orden - b.orden)
