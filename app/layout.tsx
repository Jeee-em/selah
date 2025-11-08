import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import ClientOnly from "@/components/ClientOnly"
import PuterInit from "@/components/puter-init"
import "./globals.css"

export const metadata: Metadata = {
  title: "Selah - AI-Powered Bible Verse Generator",
  description: "Pause. Reflect. Find peace in God's Word — wherever you are, whatever you feel.",
  generator: "v0.app",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <script src="https://js.puter.com/v2/"></script>
        <Suspense fallback={null}>
          <div>
            {children}
            <ClientOnly>
              <PuterInit />
            </ClientOnly>
          </div>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
