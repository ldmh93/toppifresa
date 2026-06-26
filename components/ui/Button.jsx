'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

const variants = {
  primary: 'bg-primary text-white shadow-fab hover:bg-primary-dark active:bg-primary-dark',
  secondary: 'bg-primary-50 text-primary border border-primary/20 hover:bg-primary-100',
  ghost: 'bg-transparent text-primary hover:bg-primary-50',
  white: 'bg-white text-app-text shadow-card hover:shadow-card-hover',
  whatsapp: 'bg-[#25D366] text-white shadow-fab hover:bg-[#20BA5A]',
  dark: 'bg-app-text text-white hover:bg-gray-800',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-5 py-3 text-base rounded-2xl gap-2',
  lg: 'px-6 py-4 text-lg rounded-2xl gap-2.5',
  full: 'w-full px-5 py-4 text-base rounded-2xl gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  icon,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={clsx(
        'inline-flex items-center justify-center font-semibold transition-all duration-150 select-none',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  )
}
