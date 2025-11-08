"use client"

import { useEffect } from "react"
import { usePuterStore } from "@/lib/puter"

export default function PuterInit() {
  const { init } = usePuterStore()

  useEffect(() => {
    try {
      init()
    } catch (e) {
      // swallow — the store will set errors if Puter isn't available
      // eslint-disable-next-line no-console
      console.error("Puter init failed:", e)
    }
  }, [init])

  return null
}
