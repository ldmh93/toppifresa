// ✨ TOPPINGS
//
// Lo que el cliente elige para coronar su Toppi. Están agrupados por
// categoría; cada categoría se administra desde /admin/toppings.
//
// Campos de la categoría:
//   id, name, emoji   Identidad de la categoría.
//   color             Acento de la categoría (paleta de marca).
//   activo            false esconde la categoría completa.
//   orden             Posición, de menor a mayor.
//   items             Toppings de esa categoría.
//
// Campos del topping:
//   id, name, emoji   Identidad.
//   precio            Pesos que se cobran aparte. 0 = incluido (es lo normal
//                     hoy: los toppings van sin costo extra).
//   activo            false lo esconde sin borrarlo (útil si se acabó).
//   orden             Posición dentro de su categoría.

// ⬇️ INICIO DATOS — generado por /admin, reemplaza hasta FIN DATOS
export const toppingCategories = [
  {
    id: 'crujientes',
    name: 'Crujientes',
    emoji: '🥜',
    color: '#C68A4E',
    activo: true,
    orden: 1,
    items: [
      { id: 'almendra', name: 'Almendra Fileteada', emoji: '🌰', precio: 0, activo: true, orden: 1 },
      { id: 'nuez', name: 'Nuez', emoji: '🌰', precio: 0, activo: true, orden: 2 },
      { id: 'coco', name: 'Coco', emoji: '🥥', precio: 0, activo: true, orden: 3 },
      { id: 'amaranto', name: 'Amaranto', emoji: '🌾', precio: 0, activo: true, orden: 4 },
      { id: 'granola', name: 'Granola', emoji: '🌾', precio: 0, activo: true, orden: 5 },
      { id: 'tueliges', name: 'Tueliges (galleta molida)', emoji: '🍪', precio: 0, activo: true, orden: 6 },
    ],
  },
  {
    id: 'chispas-dulces',
    name: 'Chispas y Dulces',
    emoji: '🍬',
    color: '#FF7BAC',
    activo: true,
    orden: 2,
    items: [
      { id: 'chispas-chocolate', name: 'Chispas de Chocolate', emoji: '🍫', precio: 0, activo: true, orden: 1 },
      { id: 'chispas-colores', name: 'Chispas de Colores', emoji: '🌈', precio: 0, activo: true, orden: 2 },
      { id: 'lunetas', name: 'Lunetas', emoji: '🔴', precio: 0, activo: true, orden: 3 },
      { id: 'chachitos', name: 'Chachitos', emoji: '🍡', precio: 0, activo: true, orden: 4 },
    ],
  },
  {
    id: 'cereales',
    name: 'Cereales',
    emoji: '🥣',
    color: '#F8B520',
    activo: true,
    orden: 3,
    items: [
      { id: 'froot-loops', name: 'Froot Loops', emoji: '🌈', precio: 0, activo: true, orden: 1 },
      { id: 'choco-krispis', name: 'Choco Krispis', emoji: '🐸', precio: 0, activo: true, orden: 2 },
      { id: 'nesquik', name: 'Nesquik', emoji: '🐰', precio: 0, activo: true, orden: 3 },
    ],
  },
  {
    id: 'frutas',
    name: 'Frutas',
    emoji: '🫐',
    color: '#2A843F',
    activo: true,
    orden: 4,
    items: [
      { id: 'arandanos', name: 'Arándanos', emoji: '🫐', precio: 0, activo: true, orden: 1 },
    ],
  },
  {
    id: 'coberturas',
    name: 'Coberturas',
    emoji: '🍯',
    color: '#EB6348',
    activo: true,
    orden: 5,
    items: [
      { id: 'lechera', name: 'Lechera', emoji: '🥛', precio: 0, activo: true, orden: 1 },
      { id: 'hersheys', name: "Hershey's", emoji: '🍫', precio: 0, activo: true, orden: 2 },
      { id: 'miel-maple', name: 'Miel de Maple', emoji: '🍁', precio: 0, activo: true, orden: 3 },
      { id: 'mermelada-fresa', name: 'Mermelada de Fresa', emoji: '🍓', precio: 0, activo: true, orden: 4 },
      { id: 'mermelada-zarzamora', name: 'Mermelada de Zarzamora', emoji: '🫐', precio: 0, activo: true, orden: 5 },
    ],
  },
  {
    id: 'picantes',
    name: 'Picantes',
    emoji: '🌶️',
    color: '#C3201C',
    activo: true,
    orden: 6,
    items: [
      { id: 'polvito-mango', name: 'Polvito de Mango', emoji: '🥭', precio: 0, activo: true, orden: 1 },
      { id: 'polvito-sandia', name: 'Polvito de Sandía', emoji: '🍉', precio: 0, activo: true, orden: 2 },
      { id: 'polvito-tamarindo', name: 'Polvito de Tamarindo', emoji: '🟤', precio: 0, activo: true, orden: 3 },
      { id: 'miguelito', name: 'Miguelito Tradicional', emoji: '🌶️', precio: 0, activo: true, orden: 4 },
      { id: 'banderillas', name: 'Banderillas Picantes', emoji: '🌶️', precio: 0, activo: true, orden: 5 },
      { id: 'espiral-tamarindo', name: 'Espiral de Tamarindo', emoji: '🌀', precio: 0, activo: true, orden: 6 },
    ],
  },
]
// ⬆️ FIN DATOS

/* ---------- Helpers ---------- */

/** Categorías visibles, con sus toppings activos, todo ya ordenado. */
export const getCategoriasPublicas = () =>
  toppingCategories
    .filter((c) => c.activo)
    .sort((a, b) => a.orden - b.orden)
    .map((c) => ({
      ...c,
      items: c.items.filter((i) => i.activo).sort((a, b) => a.orden - b.orden),
    }))

/** Todos los toppings activos en una sola lista. */
export const getAllToppings = () =>
  getCategoriasPublicas().flatMap((cat) => cat.items)

/** Cuántos toppings activos hay (para el panel y los textos del menú). */
export const contarToppings = () => getAllToppings().length
