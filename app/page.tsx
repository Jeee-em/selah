import { HeroSection } from "@/components/hero-section"
import { MoodPicker } from "@/components/mood-picker"
import { Footer } from "@/components/footer"
import { Nav } from "@/components/nav"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <HeroSection />
      <MoodPicker />
      <Footer />
    </main>
  )
}
