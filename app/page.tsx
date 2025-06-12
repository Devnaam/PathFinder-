import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import SkillCategoryGrid from "@/components/skill-category-grid"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <section className="container py-12 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Choose Your Path</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select a skill category to begin your learning journey or take our quiz to discover what might suit you
            best.
          </p>
        </div>

        <SkillCategoryGrid />

        <div className="flex justify-center mt-8">
          <Link href="/quiz">
            <Button className="gap-2">
              Not sure where to start? Take our quiz
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-center">How Pathfinder Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Select a Skill</h3>
              <p className="text-muted-foreground">
                Choose from our curated list of in-demand skills across various domains.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Follow Your Roadmap</h3>
              <p className="text-muted-foreground">
                Get a personalized learning path with beginner to advanced resources and projects.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore Careers</h3>
              <p className="text-muted-foreground">
                Discover job opportunities, salary ranges, and growth paths related to your skill.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
