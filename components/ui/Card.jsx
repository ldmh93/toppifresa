'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function Card({
  children,
  className,
  onClick,
  animate = true,
  padding = true,
  ...props
}) {
  const Component = onClick || animate ? motion.div : 'div'
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { type: 'spring', stiffness: 300, damping: 24 },
        whileTap: onClick ? { scale: 0.98 } : undefined,
      }
    : {}

  return (
    <Component
      onClick={onClick}
      className={clsx(
        'card-base',
        padding && 'p-4',
        onClick && 'cursor-pointer tap-scale',
        className,
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}
