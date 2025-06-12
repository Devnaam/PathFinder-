"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"

// Mock data for skill categories
const skillCategories = {
  programming: {
    title: "Programming Skills",
    description: "Master coding languages and frameworks to build software applications",
    skills: [
      { name: "JavaScript", description: "Build interactive web applications", slug: "javascript" },
      { name: "Python", description: "Create applications, analyze data, and build AI models", slug: "python" },
      { name: "Java", description: "Develop enterprise applications and Android apps", slug: "java" },
      { name: "React", description: "Build modern user interfaces and single-page applications", slug: "react" },
      { name: "Node.js", description: "Create scalable backend services and APIs", slug: "nodejs" },
      { name: "TypeScript", description: "JavaScript with static type definitions", slug: "typescript" },
    ],
  },
  design: {
    title: "Design Skills",
    description: "Create beautiful and functional designs for digital products",
    skills: [
      { name: "UI/UX Design", description: "Design user interfaces and experiences", slug: "ui-ux-design" },
      {
        name: "Graphic Design",
        description: "Create visual content for digital and print media",
        slug: "graphic-design",
      },
      { name: "Web Design", description: "Design responsive and accessible websites", slug: "web-design" },
      { name: "Figma", description: "Collaborative interface design tool", slug: "figma" },
      { name: "Adobe XD", description: "Design, prototype, and share user experiences", slug: "adobe-xd" },
      { name: "Illustration", description: "Create digital illustrations for various media", slug: "illustration" },
    ],
  },
  data: {
    title: "Data Skills",
    description: "Analyze and visualize data to extract valuable insights",
    skills: [
      {
        name: "Data Analysis",
        description: "Extract insights from data using statistical methods",
        slug: "data-analysis",
      },
      { name: "Machine Learning", description: "Build predictive models and algorithms", slug: "machine-learning" },
      { name: "SQL", description: "Query and manipulate relational databases", slug: "sql" },
      { name: "Data Visualization", description: "Create visual representations of data", slug: "data-visualization" },
      { name: "Power BI", description: "Business analytics and data visualization tool", slug: "power-bi" },
      { name: "Tableau", description: "Interactive data visualization software", slug: "tableau" },
    ],
  },
  marketing: {
    title: "Marketing Skills",
    description: "Promote products and services to reach target audiences",
    skills: [
      { name: "SEO", description: "Optimize websites for search engines", slug: "seo" },
      {
        name: "Content Writing",
        description: "Create engaging content for various platforms",
        slug: "content-writing",
      },
      {
        name: "Social Media Marketing",
        description: "Promote brands on social platforms",
        slug: "social-media-marketing",
      },
      { name: "Email Marketing", description: "Create and optimize email campaigns", slug: "email-marketing" },
      { name: "Google Ads", description: "Create and manage paid search campaigns", slug: "google-ads" },
      { name: "Analytics", description: "Measure and analyze marketing performance", slug: "analytics" },
    ],
  },
  "ai-ml": {
    title: "AI & Machine Learning Skills",
    description: "Build intelligent systems that can learn and adapt",
    skills: [
      { name: "Deep Learning", description: "Build neural networks for complex tasks", slug: "deep-learning" },
      { name: "Natural Language Processing", description: "Process and analyze human language", slug: "nlp" },
      {
        name: "Computer Vision",
        description: "Enable computers to interpret visual information",
        slug: "computer-vision",
      },
      { name: "TensorFlow", description: "Open-source machine learning framework", slug: "tensorflow" },
      { name: "PyTorch", description: "Deep learning framework for research and production", slug: "pytorch" },
      { name: "Reinforcement Learning", description: "Train agents to make decisions", slug: "reinforcement-learning" },
    ],
  },
  database: {
    title: "Database Skills",
    description: "Design and manage databases for storing and retrieving data",
    skills: [
      { name: "MySQL", description: "Open-source relational database management system", slug: "mysql" },
      { name: "MongoDB", description: "NoSQL document database", slug: "mongodb" },
      { name: "PostgreSQL", description: "Advanced open-source relational database", slug: "postgresql" },
      { name: "Redis", description: "In-memory data structure store", slug: "redis" },
      { name: "Database Design", description: "Design efficient and scalable databases", slug: "database-design" },
      { name: "SQL Server", description: "Microsoft's relational database management system", slug: "sql-server" },
    ],
  },
}

export default function SkillCategoryPage({ params }: { params: { category: string } }) {
  const router = useRouter()
  const category = skillCategories[params.category as keyof typeof skillCategories]

  if (!category) {
    notFound()
  }

  const handleViewRoadmap = (skill: any) => {
    router.push(`/skills/${params.category}/${skill.slug}?q=${encodeURIComponent(skill.name)}`)
  }

  return (
    <main className="container py-12">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{category.title}</h1>
        <p className="text-xl text-muted-foreground">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.skills.map((skill) => (
          <Card
            key={skill.slug}
            className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
            onClick={() => handleViewRoadmap(skill)}
          >
            <CardHeader>
              <CardTitle>{skill.name}</CardTitle>
              <CardDescription>{skill.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="gap-2 mt-2">
                View Roadmap <ArrowRight size={16} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
