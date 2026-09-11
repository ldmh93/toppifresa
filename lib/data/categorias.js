// 🏷️ CATEGORÍAS DEL MENÚ
//
// Son las etiquetas que clasifican los productos (Clásico, Favorito,
// Premium…). Se administran desde /admin/categorias.
//
// ⚠️ El `id` es también el texto que se muestra y el valor que guarda cada
// producto en su campo `tag`. Por eso, si renombras una categoría, hay que
// actualizar los productos que la usaban: el panel avisa cuántos son antes
// de dejarte hacerlo.
//
// Campos:
//   id      Identificador y texto visible. Estable.
//   emoji   Icono corto para los filtros.
//   activo  false la esconde de los filtros sin borrarla.
//   orden   Posición en la barra de filtros, de menor a mayor.

// ⬇️ INICIO DATOS — generado por /admin, reemplaza hasta FIN DATOS
export const categorias = [
  { id: 'Clásico', emoji: '🍓', activo: true, orden: 1 },
  { id: 'Favorito', emoji: '🔥', activo: true, orden: 2 },
  { id: 'Especial', emoji: '⭐', activo: true, orden: 3 },
  { id: 'Premium', emoji: '👑', activo: true, orden: 4 },
  { id: 'Mexicano', emoji: '🇲🇽', activo: true, orden: 5 },
  { id: 'Picante', emoji: '🌶️', activo: true, orden: 6 },
  { id: 'Nuevo', emoji: '✨', activo: true, orden: 7 },
]
// ⬆️ FIN DATOS

/* ---------- Helpers ---------- */

/** Categorías visibles, ya ordenadas. */
export const getCategoriasActivas = () =>
  categorias.filter((c) => c.activo).sort((a, b) => a.orden - b.orden)

/** Solo los nombres, que es lo que guarda `product.tag`. */
export const getNombresCategorias = () => categorias.map((c) => c.id)

export const getCategoriaById = (id) => categorias.find((c) => c.id === id)
