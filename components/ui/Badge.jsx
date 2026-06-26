import clsx from 'clsx'

const styles = {
  popular: 'bg-amber-100 text-amber-700 border border-amber-200',
  new: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  hot: 'bg-red-100 text-red-600 border border-red-200 badge-urgency',
  promo: 'bg-primary-50 text-primary border border-primary/20',
  default: 'bg-gray-100 text-gray-600 border border-gray-200',
  dark: 'bg-app-text text-white',
  mexicano: 'bg-green-100 text-green-700 border border-green-200',
  picante: 'bg-orange-100 text-orange-700 border border-orange-200',
  saludable: 'bg-teal-100 text-teal-700 border border-teal-200',
  viral: 'bg-purple-100 text-purple-700 border border-purple-200',
  premium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
}

const tagMap = {
  Clásico: 'default',
  Favorito: 'popular',
  Especial: 'promo',
  Premium: 'premium',
  Mexicano: 'mexicano',
  Picante: 'picante',
  Nuevo: 'new',
  HOY: 'hot',
  'FIN DE SEMANA': 'popular',
  ESPECIAL: 'promo',
  NUEVO: 'new',
  ENTREGA: 'dark',
}

export default function Badge({ children, type, className }) {
  const style = type || tagMap[children] || 'default'
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap',
        styles[style] || styles.default,
        className,
      )}
    >
      {children}
    </span>
  )
}
