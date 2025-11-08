"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border/50">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto text-center"
      >
        <p className="text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
          Made with
          <Heart className="h-4 w-4 text-red-400 fill-red-400" />
          and faith — Powered by Puter.js + Next.js
        </p>
      </motion.div>
    </footer>
  )
}
