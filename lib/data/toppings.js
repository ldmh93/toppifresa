export const toppingCategories = [
  {
    id: 'crujientes',
    name: 'Crujientes',
    emoji: '🥜',
    color: '#C68A4E',
    items: [
      { id: 'almendra', name: 'Almendra Fileteada', emoji: '🌰' },
      { id: 'nuez', name: 'Nuez', emoji: '🌰' },
      { id: 'coco', name: 'Coco', emoji: '🥥' },
      { id: 'amaranto', name: 'Amaranto', emoji: '🌾' },
      { id: 'granola', name: 'Granola', emoji: '🌾' },
      { id: 'tueliges', name: 'Tueliges (galleta molida)', emoji: '🍪' },
    ],
  },
  {
    id: 'chispas-dulces',
    name: 'Chispas y Dulces',
    emoji: '🍬',
    color: '#D63864',
    items: [
      { id: 'chispas-chocolate', name: 'Chispas de Chocolate', emoji: '🍫' },
      { id: 'chispas-colores', name: 'Chispas de Colores', emoji: '🌈' },
      { id: 'lunetas', name: 'Lunetas', emoji: '🔴' },
      { id: 'chachitos', name: 'Chachitos', emoji: '🍡' },
    ],
  },
  {
    id: 'cereales',
    name: 'Cereales',
    emoji: '🥣',
    color: '#FF6FD8',
    items: [
      { id: 'froot-loops', name: 'Froot Loops', emoji: '🌈' },
      { id: 'choco-krispis', name: 'Choco Krispis', emoji: '🐸' },
      { id: 'nesquik', name: 'Nesquik', emoji: '🐰' },
    ],
  },
  {
    id: 'frutas',
    name: 'Frutas',
    emoji: '🫐',
    color: '#6DB33F',
    items: [
      { id: 'arandanos', name: 'Arándanos', emoji: '🫐' },
    ],
  },
  {
    id: 'coberturas',
    name: 'Coberturas',
    emoji: '🍯',
    color: '#F5B731',
    items: [
      { id: 'lechera', name: 'Lechera', emoji: '🥛' },
      { id: 'hersheys', name: "Hershey's", emoji: '🍫' },
      { id: 'miel-maple', name: 'Miel de Maple', emoji: '🍁' },
      { id: 'mermelada-fresa', name: 'Mermelada de Fresa', emoji: '🍓' },
      { id: 'mermelada-zarzamora', name: 'Mermelada de Zarzamora', emoji: '🫐' },
    ],
  },
  {
    id: 'picantes',
    name: 'Picantes',
    emoji: '🌶️',
    color: '#FF4500',
    items: [
      { id: 'polvito-mango', name: 'Polvito de Mango', emoji: '🥭' },
      { id: 'polvito-sandia', name: 'Polvito de Sandía', emoji: '🍉' },
      { id: 'polvito-tamarindo', name: 'Polvito de Tamarindo', emoji: '🟤' },
      { id: 'miguelito', name: 'Miguelito Tradicional', emoji: '🌶️' },
      { id: 'banderillas', name: 'Banderillas Picantes', emoji: '🌶️' },
      { id: 'espiral-tamarindo', name: 'Espiral de Tamarindo', emoji: '🌀' },
    ],
  },
]

export const getAllToppings = () =>
  toppingCategories.flatMap((cat) => cat.items)
