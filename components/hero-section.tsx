import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-16">
      <div className="container flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Transform Your <span className="text-primary">Skills</span> Into a Complete Career Journey
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Pathfinder helps you master any skill with personalized roadmaps, curated resources, and career guidance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href="/skills" className="flex-1">
            <Button size="lg" className="w-full gap-2">
              <Search size={18} />
              Find a Skill
            </Button>
          </Link>
          <Link href="/quiz" className="flex-1">
            <Button size="lg" variant="outline" className="w-full">
              Take the Quiz
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-8 pt-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">100+</span>
            <span className="text-muted-foreground text-sm">Skills</span>
          </div>
          <div className="h-10 w-px bg-border"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">300+</span>
            <span className="text-muted-foreground text-sm">Resources</span>
          </div>
          <div className="h-10 w-px bg-border"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">50+</span>
            <span className="text-muted-foreground text-sm">Career Paths</span>
          </div>
        </div>
      </div>
    </section>
  )
}
