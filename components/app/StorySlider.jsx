"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { STORIES } from "@/lib/data"

const DURATION = 3000

export default function StorySlider() {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = 50
    let elapsed = 0
    const timer = setInterval(() => {
      elapsed += interval
      setProgress((elapsed / DURATION) * 100)
      if (elapsed >= DURATION) {
        elapsed = 0
        setProgress(0)
        setCurrent((prev) => (prev + 1) % STORIES.length)
      }
    }, interval)
    return () => clearInterval(timer)
  }, [current])

  const story = STORIES[current]

  return (
    <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden h-52 shadow-md">
      <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
        {STORIES.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: i < current ? "100%" : i === current ? `${progress}%` : "0%", transition: "none" }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35 }}
          className={`absolute inset-0 flex flex-col items-center justify-center text-white p-6 ${story.bg}`}
        >
          <span className="text-6xl mb-3">{story.emoji}</span>
          <h3 className="text-2xl font-black text-center">{story.producto}</h3>
          <p className="text-white/80 text-sm text-center mt-1">{story.descripcion}</p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
        {STORIES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setProgress(0) }}
            className={`h-1.5 rounded-full bg-white transition-all ${i === current ? "w-4" : "w-1.5 opacity-50"}`}
          />
        ))}
      </div>
    </div>
  )
}
