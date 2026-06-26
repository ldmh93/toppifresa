export const products = [
  {
    id: 'toppi-tradicional',
    name: 'ToppiTradicional',
    tagline: 'El clásico que nunca falla',
    description:
      'Fresas premium con nuestra crema especial y los toppings que tú eliges. Un gusto sencillo, pero inolvidable.',
    emoji: '🍓',
    colors: { from: '#E8194A', to: '#B02952', text: '#ffffff' },
    tag: 'Clásico',
    popular: true,
    isNew: false,
    toppings: ['Crema Especial', 'Toppings a elegir'],
    price: 55,
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
    toppings: ['Crema', 'Oreo Triturado', 'Toppings a elegir'],
    price: 65,
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
    toppings: ['Crema', 'Durazno', 'Toppings a elegir'],
    price: 70,
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
    toppings: ['Crema', 'Crema de Avellana', 'Toppings a elegir'],
    price: 65,
  },
  {
    id: 'toppi-bubulubu',
    name: 'ToppiBubulubu',
    tagline: 'La combinación más juguetona',
    description:
      'Fresas con crema y Bubulubu en trocitos entre tus toppings favoritos. ¡Explosión de sabor!',
    emoji: '🍫',
    colors: { from: '#D63864', to: '#7B1830', text: '#ffffff' },
    tag: 'Favorito',
    popular: true,
    isNew: false,
    toppings: ['Crema', 'Bubulubu en trocitos', 'Toppings a elegir'],
    price: 65,
  },
  {
    id: 'toppi-mazapan',
    name: 'ToppiMazapan',
    tagline: '¡Qué delicia!',
    description:
      'Fresas con crema + mazapán y toppings que te harán decir "¡qué delicia!".',
    emoji: '🌸',
    colors: { from: '#F5B731', to: '#C68B1A', text: '#1C1C1E' },
    tag: 'Mexicano',
    popular: false,
    isNew: false,
    toppings: ['Crema', 'Mazapán De La Rosa', 'Toppings a elegir'],
    price: 65,
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
    toppings: ['Chamoy', 'Gomitas', 'Miguelito'],
    price: 65,
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
    toppings: ['Fresas', 'Plátano', 'Salsas Dulces', 'Toppings a elegir'],
    price: 50,
  },
]

export const getFeaturedProducts = () =>
  products.filter((p) => p.popular)

export const getProductById = (id) =>
  products.find((p) => p.id === id)
