'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { products } from '@/lib/data/products'

const stories = [
  { id: 'promos', label: 'Promos', emoji: '🎉', href: '/promos', gradient: 'from-amber-400 to-orange-500' },
  ...products.slice(0, 6).map((p) => ({
    id: p.id,
    label: p.name.replace('Toppi', ''),
    emoji: p.emoji,
    href: '/productos',
    gradient: 'from-primary to-primary-dark',
  })),
  { id: 'toppings', label: 'Toppings', emoji: '✨', href: '/toppings', gradient: 'from-purple-500 to-pink-500' },
]

export default function StorySlider() {
  return (
    <section className="mt-4">
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5 pb-2">
        {stories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 24 }}
            className="flex-shrink-0"
          >
            <Link href={story.href} className="flex flex-col items-center gap-1.5 tap-scale">
              <div className="story-ring">
                <div
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl"
                  style={{ margin: '2px' }}
                >
                  <span>{story.emoji}</span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-app-text text-center max-w-[64px] leading-tight">
                {story.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
