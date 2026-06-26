export const toppingCategories = [
  {
    id: 'cremas',
    name: 'Cremas',
    emoji: '🍦',
    color: '#FF6B8A',
    items: [
      { id: 'crema-batida', name: 'Crema Batida', emoji: '🍦' },
      { id: 'leche-condensada', name: 'Leche Condensada', emoji: '🥛' },
      { id: 'crema-avellana', name: 'Crema de Avellana', emoji: '🌰' },
      { id: 'yogur-griego', name: 'Yogur Griego', emoji: '🫙' },
      { id: 'cajeta', name: 'Cajeta', emoji: '🍯' },
    ],
  },
  {
    id: 'galletas',
    name: 'Galletas',
    emoji: '🍪',
    color: '#2D2D2D',
    items: [
      { id: 'oreo', name: 'Oreo', emoji: '🍪' },
      { id: 'maria', name: 'Galleta María', emoji: '🫓' },
      { id: 'oblea', name: 'Oblea', emoji: '🍘' },
    ],
  },
  {
    id: 'chocolates',
    name: 'Chocolates',
    emoji: '🍫',
    color: '#6B3A2A',
    items: [
      { id: 'chocolate-negro', name: 'Chocolate Negro', emoji: '🍫' },
      { id: 'chocolate-blanco', name: 'Chocolate Blanco', emoji: '🤍' },
      { id: 'chispas', name: 'Chispas de Chocolate', emoji: '✨' },
      { id: 'nutella', name: 'Nutella', emoji: '🫙' },
    ],
  },
  {
    id: 'dulces-mexicanos',
    name: 'Dulces Mexicanos',
    emoji: '🍬',
    color: '#D63864',
    items: [
      { id: 'bubulubu', name: 'Bubulubu', emoji: '🍬' },
      { id: 'mazapan', name: 'Mazapán De La Rosa', emoji: '🟡' },
      { id: 'chachitos', name: 'Chachitos', emoji: '🍡' },
      { id: 'pulparindo', name: 'Pulparindo', emoji: '🌶️' },
      { id: 'paleta-payaso', name: 'Paleta Payaso', emoji: '🎪' },
    ],
  },
  {
    id: 'picantes',
    name: 'Picantes',
    emoji: '🌶️',
    color: '#FF4500',
    items: [
      { id: 'chamoy', name: 'Chamoy', emoji: '🫙' },
      { id: 'chile-limon', name: 'Chile Limón', emoji: '🍋' },
      { id: 'tajin', name: 'Tajín', emoji: '🌶️' },
    ],
  },
  {
    id: 'cereales',
    name: 'Cereales',
    emoji: '🥣',
    color: '#FF6FD8',
    items: [
      { id: 'frootloops', name: 'Froot Loops', emoji: '🌈' },
      { id: 'granola', name: 'Granola Artesanal', emoji: '🌾' },
      { id: 'zucaritas', name: 'Zucaritas', emoji: '🐯' },
    ],
  },
  {
    id: 'frutas',
    name: 'Frutas',
    emoji: '🍑',
    color: '#6DB33F',
    items: [
      { id: 'kiwi', name: 'Kiwi', emoji: '🥝' },
      { id: 'mango', name: 'Mango', emoji: '🥭' },
      { id: 'platano', name: 'Plátano', emoji: '🍌' },
      { id: 'blueberry', name: 'Blueberry', emoji: '🫐' },
    ],
  },
  {
    id: 'extras',
    name: 'Extras',
    emoji: '✨',
    color: '#F5B731',
    items: [
      { id: 'miel', name: 'Miel de Abeja', emoji: '🍯' },
      { id: 'caramelo', name: 'Caramelo', emoji: '🍮' },
      { id: 'jarabe-fresa', name: 'Jarabe de Fresa', emoji: '🍓' },
      { id: 'grageas', name: 'Grageas de Colores', emoji: '🎨' },
      { id: 'semillas', name: 'Semillas Mix', emoji: '🌻' },
    ],
  },
]

export const getAllToppings = () =>
  toppingCategories.flatMap((cat) => cat.items)
