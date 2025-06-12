"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { generateWithGemini } from "@/lib/gemini-api"

export default function SkillSearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const prompt = `User is searching for skills related to "${query}". Return 6 relevant skills as a JSON array. Each skill should have: name (string), category (one of: programming, design, data, marketing, ai-ml, database), description (short string), and difficulty (string: beginner, intermediate, or advanced). Format as a valid JSON array without any explanation or additional text.`

        const response = await generateWithGemini(prompt)

        // Parse the JSON response
        const skillsData = JSON.parse(response)
        setSearchResults(skillsData)
      } catch (error) {
        console.error("Error searching skills:", error)
        setError("Failed to load search results. Please try again.")
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  const getCategorySlug = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, "-")
  }

  const getSkillSlug = (skill: string) => {
    return skill.toLowerCase().replace(/\s+/g, "-")
  }

  return (
    <main className="container py-12">
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <Link href="/skills">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Search Results: {query}</h1>
        </div>
        <p className="text-muted-foreground">Showing skills related to your search</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Searching for skills...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error}</p>
          <Link href="/skills">
            <Button variant="outline" className="mt-4">
              Back to Skills
            </Button>
          </Link>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No skills found matching your search.</p>
          <Link href="/skills">
            <Button variant="outline" className="mt-4">
              Back to Skills
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((skill, index) => (
            <Link key={index} href={`/skills/${getCategorySlug(skill.category)}/${getSkillSlug(skill.name)}`}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{skill.name}</CardTitle>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full capitalize">{skill.difficulty}</span>
                  </div>
                  <CardDescription>{skill.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {skill.category}
                    </Badge>
                    <Button variant="ghost" className="gap-2">
                      View Roadmap <ArrowRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
