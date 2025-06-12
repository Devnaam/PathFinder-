"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { generateWithGemini, safeJsonParse } from "@/lib/gemini-api"
import SkillCategoryGrid from "@/components/skill-category-grid"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

// Fallback data for when API fails
const fallbackFeaturedSkills = [
  {
    name: "Machine Learning",
    category: "ai-ml",
    description: "Build intelligent systems that learn from data",
    difficulty: "advanced",
  },
  {
    name: "React Development",
    category: "programming",
    description: "Create interactive user interfaces with React",
    difficulty: "intermediate",
  },
  {
    name: "Data Visualization",
    category: "data",
    description: "Transform complex data into visual insights",
    difficulty: "intermediate",
  },
  {
    name: "UX/UI Design",
    category: "design",
    description: "Design user-centered digital experiences",
    difficulty: "intermediate",
  },
  {
    name: "Content Marketing",
    category: "marketing",
    description: "Create and distribute valuable content to attract customers",
    difficulty: "beginner",
  },
  {
    name: "Cloud Architecture",
    category: "database",
    description: "Design and implement cloud-based systems",
    difficulty: "advanced",
  },
]

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [featuredSkills, setFeaturedSkills] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [skillOverview, setSkillOverview] = useState<any>(null)
  const router = useRouter()

  // Handle direct search submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim().length < 2) return

    setIsSearching(true)
    try {
      // Navigate to the skill detail page with the search query
      const formattedQuery = searchQuery.toLowerCase().replace(/\s+/g, "-")
      // Determine the most likely category based on the skill
      const categoryPrompt = `What category does the skill "${searchQuery}" belong to? Choose only one from: programming, design, data, marketing, ai-ml, database. Return only the category name without any explanation.`
      const categoryResponse = await generateWithGemini(categoryPrompt)
      const category = categoryResponse.trim().toLowerCase()

      router.push(`/skills/${category}/${formattedQuery}?q=${encodeURIComponent(searchQuery)}`)
    } catch (error) {
      console.error("Error processing skill search:", error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const fetchFeaturedSkills = async () => {
      setIsLoading(true)
      try {
        const prompt = `List the most in-demand skills for 2025 in tech and business fields. Return the response as a JSON array of 6 skills. Each skill should have: name (string), category (one of: programming, design, data, marketing, ai-ml, database), description (short string), and difficulty (string: beginner, intermediate, or advanced). Format as a valid JSON array without any explanation or additional text.`

        const response = await generateWithGemini(prompt)

        // Parse the JSON response with fallback
        const skillsData = safeJsonParse(response, fallbackFeaturedSkills)
        setFeaturedSkills(skillsData)
      } catch (error) {
        console.error("Error fetching featured skills:", error)
        // Fallback data
        setFeaturedSkills(fallbackFeaturedSkills)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedSkills()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true)
        try {
          // Get skill suggestions
          const suggestionsPrompt = `User is searching for "${searchQuery}" in a skills database. Return 3 relevant skills as a JSON array. Each skill should have: name (string), category (one of: programming, design, data, marketing, ai-ml, database), and description (short string). Format as a valid JSON array without any explanation or additional text.`
          const suggestionsResponse = await generateWithGemini(suggestionsPrompt)
          const searchData = safeJsonParse(suggestionsResponse, [])
          setSearchResults(searchData)

          // Get skill overview for the first result
          if (searchData.length > 0) {
            const overviewPrompt = `Give a skill overview and a roadmap for learning ${searchQuery} in 2025. Format the response as JSON with the following structure:
            {
              "overview": "Brief overview of the skill and its importance",
              "roadmap": [
                {"step": "Step 1", "description": "Brief description"},
                {"step": "Step 2", "description": "Brief description"},
                {"step": "Step 3", "description": "Brief description"}
              ]
            }
            Return ONLY the JSON without any additional text or explanation.`

            const overviewResponse = await generateWithGemini(overviewPrompt)
            const overviewData = safeJsonParse(overviewResponse, null)
            setSkillOverview(overviewData)
          } else {
            setSkillOverview(null)
          }
        } catch (error) {
          console.error("Error searching skills:", error)
          setSearchResults([])
          setSkillOverview(null)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setSkillOverview(null)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const getCategorySlug = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, "-")
  }

  const getSkillSlug = (skill: string) => {
    return skill.toLowerCase().replace(/\s+/g, "-")
  }

  return (
    <main className="container py-12">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Explore Skills</h1>
        <p className="text-xl text-muted-foreground">Discover skills that match your interests and career goals</p>

        <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto mt-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a skill..."
            className="pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
          <Button type="submit" className="sr-only">
            Search
          </Button>

          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
              {searchResults.map((result, index) => (
                <Link
                  key={index}
                  href={`/skills/${getCategorySlug(result.category)}/${getSkillSlug(result.name)}?q=${encodeURIComponent(result.name)}`}
                  className="block p-3 hover:bg-muted border-b last:border-0"
                >
                  <div className="font-medium">{result.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="capitalize">{result.category}</span>
                    <span>•</span>
                    <span>{result.description}</span>
                  </div>
                </Link>
              ))}

              {skillOverview && (
                <div className="p-4 border-t">
                  <h3 className="font-medium mb-2">Overview: {searchQuery}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{skillOverview.overview}</p>

                  <h4 className="text-sm font-medium mb-2">Quick Roadmap:</h4>
                  <ul className="text-sm space-y-1">
                    {skillOverview.roadmap.map((step: any, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">
                          {step.step}
                        </Badge>
                        <span className="text-muted-foreground">{step.description}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={(e) => {
                      e.preventDefault()
                      const formattedQuery = searchQuery.toLowerCase().replace(/\s+/g, "-")
                      const category = searchResults[0]?.category || "programming"
                      router.push(
                        `/skills/${getCategorySlug(category)}/${formattedQuery}?q=${encodeURIComponent(searchQuery)}`,
                      )
                    }}
                  >
                    View Full Roadmap
                  </Button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Skill Categories</h2>
          <SkillCategoryGrid />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Featured Skills for 2025</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSkills.map((skill, index) => (
                <Link
                  key={index}
                  href={`/skills/${getCategorySlug(skill.category)}/${getSkillSlug(skill.name)}?q=${encodeURIComponent(skill.name)}`}
                >
                  <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{skill.name}</CardTitle>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full capitalize">{skill.difficulty}</span>
                      </div>
                      <CardDescription>{skill.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="gap-2 mt-2">
                        View Roadmap <ArrowRight size={16} />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
