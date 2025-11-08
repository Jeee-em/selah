"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { MoodCard } from "@/components/mood-card"
import { VerseDisplay } from "@/components/verse-display"
import { usePuterStore } from "@/lib/puter"

const moods = [
  { emoji: "😃", label: "Happy", color: "from-yellow-200/50 to-orange-200/50" },
  { emoji: "😢", label: "Sad", color: "from-blue-200/50 to-indigo-200/50" },
  { emoji: "😰", label: "Anxious", color: "from-purple-200/50 to-pink-200/50" },
  { emoji: "🙏", label: "Grateful", color: "from-green-200/50 to-teal-200/50" },
  { emoji: "😔", label: "Lonely", color: "from-slate-200/50 to-gray-200/50" },
  { emoji: "😠", label: "Angry", color: "from-red-200/50 to-rose-200/50" },
  { emoji: "🕊️", label: "Peaceful", color: "from-cyan-200/50 to-sky-200/50" },
  { emoji: "😞", label: "Hopeless", color: "from-gray-300/50 to-slate-300/50" },
]

export function MoodPicker() {
  const router = useRouter()
  const { auth } = usePuterStore()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [showVerse, setShowVerse] = useState(false)

  // Check if user is authenticated before showing verse
  const handleMoodSelect = (mood: string) => {
    // If not authenticated, redirect to auth page
    if (!auth.isAuthenticated) {
      router.push('/auth?next=/')
      return
    }

    // Otherwise, show the verse
    setSelectedMood(mood)
    setShowVerse(true)
  }

  const handleGenerateAnother = () => {
    setShowVerse(false)
    setTimeout(() => setShowVerse(true), 300)
  }

  return (
    <section id="mood-picker" className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <AnimatePresence mode="wait">
          {!showVerse ? (
            <motion.div
              key="mood-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                  How are you feeling today?
                </h2>
                <p className="text-lg text-muted-foreground text-balance">
                  Select your mood to receive a personalized Bible verse
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {moods.map((mood, index) => (
                  <MoodCard key={mood.label} mood={mood} index={index} onSelect={handleMoodSelect} />
                ))}
              </div>
            </motion.div>
          ) : (
            <VerseDisplay
              mood={selectedMood!}
              onGenerateAnother={handleGenerateAnother}
              onBack={() => setShowVerse(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
