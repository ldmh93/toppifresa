// 🍓 CATÁLOGO DE PRODUCTOS
//
// Esta es la fuente única del menú. Para cambiar el menú se edita este
// archivo y se publica (push a main → Vercel despliega solo).
//
// El panel /admin/productos permite editarlo con una interfaz y te entrega
// el bloque de código ya listo para pegar aquí.
//
// Campos:
//   id           Identificador único. NO lo cambies una vez publicado: es lo
//                que guarda el carrito del cliente en su teléfono.
//   name         Nombre comercial.
//   tagline      Frase corta que acompaña al nombre.
//   description  Texto largo de la ficha.
//   emoji        Icono de respaldo cuando no hay foto.
//   colors       Degradado de la tarjeta. `text` debe contrastar con el fondo.
//   tag          Categoría visible. Debe coincidir con un id de categorias.js.
//   popular      Aparece en "Favoritos".
//   isNew        Muestra el distintivo "Nuevo".
//   incluye      Ingredientes que ya trae de fábrica (no son los toppings
//                que elige el cliente: esos viven en toppings.js).
//   price        Precio en pesos, sin centavos.
//   imageUrl     Foto opcional. Si está vacío se usa el emoji.
//   estado       'disponible' | 'agotado' | 'pausado'  (ver ESTADOS)
//   orden        Posición en el menú, de menor a mayor.
//   sabores      IDs de sabores.js que el cliente puede elegir. Vacío = el
//                producto se vende tal cual (comportamiento actual).

/** Estados posibles de un producto. */
export const ESTADOS = {
  disponible: { label: 'Disponible', color: '#2A843F', vendible: true },
  agotado: { label: 'Agotado', color: '#C3201C', vendible: false },
  pausado: { label: 'No disponible por ahora', color: '#7C6668', vendible: false },
}

// Las categorías viven en su propio archivo y se administran desde
// /admin/categorias. Se reexportan aquí por comodidad de los consumidores.
export { getNombresCategorias as getCategorias } from './categorias.js'

// ⬇️ INICIO DATOS — generado por /admin, reemplaza hasta FIN DATOS
export const products = [
  {
    id: 'toppi-tradicional',
    name: 'ToppiTradicional',
    tagline: 'El clásico que nunca falla',
    description:
      'Fresas premium con nuestra crema especial y los toppings que tú eliges. Un gusto sencillo, pero inolvidable.',
    emoji: '🍓',
    colors: { from: '#B5191A', to: '#6B0306', text: '#ffffff' },
    tag: 'Clásico',
    popular: true,
    isNew: false,
    incluye: ['Crema Especial', 'Toppings a elegir'],
    price: 55,
    imageUrl: '',
    estado: 'disponible',
    orden: 1,
    sabores: [],
  },
  {
    id: 'toppi-oreo',
    name: 'ToppiOreo',
    tagline: 'Dulzura + crunch = felicidad',
    description:
      'Fresas con crema y Oreo triturado bañadas con tus toppings favoritos. ¡Un clásico reinventado!',
    emoji: '🍪',
    colors: { from: '#2D2D2D', to: '#111111', text: '#ffffff' },
    tag: 'Favorito',
    popular: true,
    isNew: false,
    incluye: ['Crema', 'Oreo Triturado', 'Toppings a elegir'],
    price: 65,
    imageUrl: '',
    estado: 'disponible',
    orden: 2,
    sabores: [],
  },
  {
    id: 'toppi-duo',
    name: 'ToppiDuo',
    tagline: 'Doble placer en un solo vaso',
    description:
      'Fresas con crema + durazno jugoso, coronados con toppings irresistibles. ¡Doble placer en un solo vaso!',
    emoji: '🍑',
    colors: { from: '#FF9A3C', to: '#E07020', text: '#ffffff' },
    tag: 'Especial',
    popular: false,
    isNew: false,
    incluye: ['Crema', 'Durazno', 'Toppings a elegir'],
    price: 70,
    imageUrl: '',
    estado: 'disponible',
    orden: 3,
    sabores: [],
  },
  {
    id: 'toppi-avellana',
    name: 'ToppiAvellana',
    tagline: 'Sofisticación en cada bocado',
    description:
      'Fresas con crema y un toque de avellana que te hará suspirar. Sofisticación en cada bocado.',
    emoji: '🌰',
    colors: { from: '#C68642', to: '#8B5E3C', text: '#ffffff' },
    tag: 'Premium',
    popular: true,
    isNew: false,
    incluye: ['Crema', 'Crema de Avellana', 'Toppings a elegir'],
    price: 65,
    imageUrl: '',
    estado: 'disponible',
    orden: 4,
    sabores: [],
  },
  {
    id: 'toppi-bubulubu',
    name: 'ToppiBubulubu',
    tagline: 'La combinación más juguetona',
    description:
      'Fresas con crema y Bubulubu en trocitos entre tus toppings favoritos. ¡Explosión de sabor!',
    emoji: '🍫',
    colors: { from: '#E2787D', to: '#9C0B0A', text: '#ffffff' },
    tag: 'Favorito',
    popular: true,
    isNew: false,
    incluye: ['Crema', 'Bubulubu en trocitos', 'Toppings a elegir'],
    price: 65,
    imageUrl: '',
    estado: 'disponible',
    orden: 5,
    sabores: [],
  },
  {
    id: 'toppi-mazapan',
    name: 'ToppiMazapan',
    tagline: '¡Qué delicia!',
    description:
      'Fresas con crema + mazapán y toppings que te harán decir "¡qué delicia!".',
    emoji: '🌸',
    colors: { from: '#F8B520', to: '#C68B1A', text: '#241012' },
    tag: 'Mexicano',
    popular: false,
    isNew: false,
    incluye: ['Crema', 'Mazapán De La Rosa', 'Toppings a elegir'],
    price: 65,
    imageUrl: '',
    estado: 'disponible',
    orden: 6,
    sabores: [],
  },
  {
    id: 'toppi-picosito',
    name: 'ToppiPicosito',
    tagline: 'Para los que aman lo atrevido',
    description:
      'Fresas con chamoy, gomitas y Miguelito de sabor. Un equilibrio entre lo dulce y lo picosito.',
    emoji: '🌶️',
    colors: { from: '#FF4500', to: '#C0392B', text: '#ffffff' },
    tag: 'Picante',
    popular: false,
    isNew: false,
    incluye: ['Chamoy', 'Gomitas', 'Miguelito'],
    price: 65,
    imageUrl: '',
    estado: 'disponible',
    orden: 7,
    sabores: [],
  },
  {
    id: 'toppi-cakes',
    name: 'ToppiCakes',
    tagline: 'Orden de 12 mini hot cakes',
    description:
      'Mini Hot Cakes acompañados de fresas y plátano con salsas dulces y toppings a elegir.',
    emoji: '🥞',
    colors: { from: '#F5A623', to: '#C47D0A', text: '#ffffff' },
    tag: 'Nuevo',
    popular: true,
    isNew: true,
    incluye: ['Fresas', 'Plátano', 'Salsas Dulces', 'Toppings a elegir'],
    price: 50,
    imageUrl: '',
    estado: 'disponible',
    orden: 8,
    sabores: [],
  },
]
// ⬆️ FIN DATOS

/* ---------- Helpers ---------- */

/** ¿Se puede pedir este producto ahora mismo? */
export const esVendible = (p) => ESTADOS[p.estado]?.vendible ?? true

/** Productos que ve el cliente, ya ordenados. Los pausados no aparecen;
 *  los agotados sí, pero marcados (para que se vea que existen). */
export const getProductosPublicos = () =>
  products
    .filter((p) => p.estado !== 'pausado')
    .sort((a, b) => a.orden - b.orden)

export const getProductById = (id) => products.find((p) => p.id === id)
