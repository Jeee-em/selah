"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface MoodCardProps {
  mood: {
    emoji: string
    label: string
    color: string
  }
  index: number
  onSelect: (mood: string) => void
}

export function MoodCard({ mood, index, onSelect }: MoodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        className={`cursor-pointer p-8 rounded-2xl bg-gradient-to-br ${mood.color} border-2 border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl`}
        onClick={() => onSelect(mood.label)}
      >
        <div className="text-center">
          <div className="text-5xl md:text-6xl mb-4">{mood.emoji}</div>
          <h3 className="text-xl font-semibold text-foreground">{mood.label}</h3>
        </div>
      </Card>
    </motion.div>
  )
}
