"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Sparkles, Copy, Check } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { usePuterStore } from "@/lib/puter"
import { prepareInstructions, AIResponseFormat } from "@/constant/index"

interface VerseDisplayProps {
  mood: string
  onGenerateAnother: () => void
  onBack: () => void
  // Optional props provided by the Puter AI integration
  verse?: string | { text: string; reference?: string; reflection?: string }
  loading?: boolean
}

// Local fallback verses when AI is unavailable or returns an error
const fallbackMap: Record<string, { text: string; reference: string; reflection: string }> = {
  Happy: {
    text: "This is the day that the Lord has made; let us rejoice and be glad in it.",
    reference: "Psalm 118:24",
    reflection: "Joy is a gift from God. Celebrate this moment and share your happiness with others.",
  },
  Sad: {
    text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    reference: "Psalm 34:18",
    reflection: "In your sadness, remember that God is near. He sees your tears and holds you close.",
  },
  Anxious: {
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reference: "Philippians 4:6",
    reflection: "Anxiety can feel overwhelming, but God invites you to bring your worries to Him in prayer.",
  },
  Grateful: {
    text: "Give thanks to the Lord, for he is good; his love endures forever.",
    reference: "Psalm 107:1",
    reflection: "Gratitude opens our hearts to see God's goodness in every moment of our lives.",
  },
  Lonely: {
    text: "The Lord himself goes before you and will be with you; he will never leave you nor forsake you.",
    reference: "Deuteronomy 31:8",
    reflection: "Even in loneliness, you are never truly alone. God walks beside you always.",
  },
  Angry: {
    text: "In your anger do not sin: Do not let the sun go down while you are still angry.",
    reference: "Ephesians 4:26",
    reflection: "Anger is a natural emotion, but God calls us to process it with wisdom and grace.",
  },
  Peaceful: {
    text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives.",
    reference: "John 14:27",
    reflection: "True peace comes from Christ. Rest in His presence and let His calm fill your soul.",
  },
  Hopeless: {
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
    reflection: "Even in the darkest moments, God has a plan for your life. Hope is never lost when we trust in Him.",
  },
}

export function VerseDisplay({ mood, onGenerateAnother, onBack, verse: aiVerse, loading }: VerseDisplayProps) {
  const { ai } = usePuterStore()

  const [isLoading, setIsLoading] = useState<boolean>(loading ?? true)
  const [verse, setVerse] = useState<{ text: string; reference: string; reflection: string }>(
    fallbackMap[mood] ?? fallbackMap.Happy
  )
  const [summary, setSummary] = useState<string | null>(null)
  const [story, setStory] = useState<{ title?: string; reference?: string; text?: string } | null>(null)
  const [prayer, setPrayer] = useState<{ title?: string; text?: string } | null>(null)
  const [regenerateKey, setRegenerateKey] = useState(0)
  const [usedReferences, setUsedReferences] = useState<string[]>([]) // Track used verses and stories
  const [isCopied, setIsCopied] = useState(false)

  // Function to copy verse to clipboard
  const handleCopyVerse = async () => {
    const verseText = `"${verse.text}"\n— ${verse.reference}`
    try {
      await navigator.clipboard.writeText(verseText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy verse:', err)
    }
  }

  // Function to handle generating another verse
  const handleGenerateAnother = () => {
    setRegenerateKey(prev => prev + 1) // Trigger re-generation
  }

  useEffect(() => {
    let mounted = true

    const doGenerate = async () => {
      setIsLoading(true)
      // Reset summary, story, and prayer
      setSummary(null)
      setStory(null)
      setPrayer(null)
      
      // If parent provided AI verse directly, use it
      if (aiVerse) {
        if (typeof aiVerse === "object") {
          if (mounted) {
            const v = aiVerse as any
            setVerse({ text: v.text ?? "", reference: v.reference ?? "", reflection: v.reflection ?? "" })
            setIsLoading(false)
          }
          return
        }
        // If aiVerse is a string, try parsing it
        if (typeof aiVerse === "string") {
          try {
            const parsed = JSON.parse(aiVerse)
            if (parsed.verses?.[0]) {
              const v = parsed.verses[0]
              if (mounted) {
                setVerse({ text: v.text ?? "", reference: v.reference ?? "", reflection: v.reflection ?? "" })
                setIsLoading(false)
              }
              return
            }
          } catch (e) {
            // If parsing fails, fall through to AI generation
          }
        }
      }

      // Otherwise, call Puter AI if available
      if (ai) {
        try {
          // Generate unique seed for variety in AI responses
          const seed = Date.now() + Math.random()
          const instr = prepareInstructions({ 
            mood, 
            AIResponseFormat, 
            seed,
            usedReferences: usedReferences.length > 0 ? usedReferences : undefined
          })
          const response = await ai.chat(instr)

          if (!response) {
            // Fall back to local verse
            if (mounted) {
              setVerse(fallbackMap[mood] ?? fallbackMap.Happy)
              setIsLoading(false)
            }
            return
          }

          const responseText = typeof response.message.content === 'string' 
            ? response.message.content 
            : response.message.content[0].text

          try {
            const data = JSON.parse(responseText)

            // Extract summary, story, and prayer
            if (data.summary && mounted) setSummary(data.summary)
            if (data.story && mounted) setStory(data.story)
            if (data.prayer && mounted) setPrayer(data.prayer)

            // Extract first verse
            if (Array.isArray(data.verses) && data.verses.length > 0) {
              const v = data.verses[0]
              if (mounted) {
                setVerse({
                  text: v.text ?? '',
                  reference: v.reference ?? '',
                  reflection: v.reflection ?? ''
                })
                
                // Track used references to avoid repetition
                const newReferences: string[] = []
                if (v.reference) newReferences.push(v.reference)
                if (data.story?.reference) newReferences.push(data.story.reference)
                if (newReferences.length > 0) {
                  setUsedReferences(prev => [...prev, ...newReferences])
                }
                
                setIsLoading(false)
              }
              return
            }
          } catch (parseError: any) {
            // eslint-disable-next-line no-console
            console.error("Failed to parse AI response JSON:", parseError)
            // eslint-disable-next-line no-console
            console.log("Raw response text:", responseText)
            
            // Try to show the problematic part
            const match = parseError.message?.match(/position (\d+)/)
            if (match) {
              const pos = parseInt(match[1])
              const start = Math.max(0, pos - 50)
              const end = Math.min(responseText.length, pos + 50)
              // eslint-disable-next-line no-console
              console.log("Error near position", pos, ":", responseText.substring(start, end))
              // eslint-disable-next-line no-console
              console.log("Character at error:", responseText[pos], "Code:", responseText.charCodeAt(pos))
            }
            
            // Fall back to local verse
            if (mounted) {
              setVerse(fallbackMap[mood] ?? fallbackMap.Happy)
              setIsLoading(false)
            }
            return
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Puter ai.chat failed:", err)
        }
      }

      // Fallback to local map
      if (mounted) {
        setVerse(fallbackMap[mood] ?? fallbackMap.Happy)
        setIsLoading(false)
      }
    }

    doGenerate()

    return () => {
      mounted = false
    }
  }, [mood, aiVerse, loading, ai, regenerateKey]) // Added regenerateKey to trigger re-generation

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Button variant="ghost" onClick={onBack} className="cursor-pointer mb-8 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to moods
      </Button>

      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 text-primary mb-4"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Verse for when you feel {mood}</span>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-3xl p-12 shadow-2xl text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="inline-block"
            >
              <Sparkles className="h-12 w-12 text-primary" />
            </motion.div>
            <p className="mt-6 text-muted-foreground">Finding the perfect verse for you...</p>
          </motion.div>
        ) : (
          <motion.div
            key="verse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl space-y-6"
          >
            {/* Bible Verse */}
            <div className="relative">
              <blockquote className="text-xl md:text-2xl font-light text-foreground leading-relaxed italic border-l-4 border-primary pl-6">
                &ldquo;{verse.text}&rdquo;
              </blockquote>

              {/* Reference with Copy Button */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-base md:text-lg font-semibold text-primary">
                  — {verse.reference}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyVerse}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Copy verse to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Reflection & Summary */}
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 space-y-3">
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
                {verse.reflection}
              </p>
              {summary ? (
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed pt-3">
                  {summary}
                </p>
              ) : null}
            </div>

            {/* Bible Story */}
            {story ? (
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">
                    {story.title ?? 'Bible Story'}
                  </h4>
                </div>
                {story.reference ? (
                  <p className="text-xs text-primary/70 mb-2 font-medium">
                    {story.reference}
                  </p>
                ) : null}
                <p className="text-sm md:text-base text-foreground/85 leading-relaxed">
                  {story.text}
                </p>
              </div>
            ) : null}

            {/* Prayer */}
            {prayer ? (
              <div className="bg-muted/30 rounded-xl p-5 border border-border/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">
                    {prayer.title ?? 'Prayer'}
                  </h4>
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
                  {prayer.text}
                </p>
              </div>
            ) : null}

            {/* Generate Another Button */}
            <div className="pt-4 flex justify-center">
              <Button
                size="lg"
                onClick={handleGenerateAnother}
                className="cursor-pointer rounded-2xl px-8 py-6 text-base md:text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Generate Another Verse
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
