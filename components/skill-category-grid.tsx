import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, PenTool, BarChart3, Megaphone, Brain, Database } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    title: "Programming",
    description: "Web, mobile, and software development skills",
    icon: <Code className="h-6 w-6 text-primary" />,
    slug: "programming",
  },
  {
    title: "Design",
    description: "UI/UX, graphic design, and visual communication",
    icon: <PenTool className="h-6 w-6 text-primary" />,
    slug: "design",
  },
  {
    title: "Data",
    description: "Data analysis, machine learning, and AI",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    slug: "data",
  },
  {
    title: "Marketing",
    description: "SEO, content writing, and digital marketing",
    icon: <Megaphone className="h-6 w-6 text-primary" />,
    slug: "marketing",
  },
  {
    title: "AI & ML",
    description: "Artificial intelligence and machine learning",
    icon: <Brain className="h-6 w-6 text-primary" />,
    slug: "ai-ml",
  },
  {
    title: "Database",
    description: "Database design, management, and optimization",
    icon: <Database className="h-6 w-6 text-primary" />,
    slug: "database",
  },
]

export default function SkillCategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link href={`/skills/${category.slug}`} key={category.slug}>
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">{category.icon}</div>
              <div>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
