"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { generateWithGemini, safeJsonParse } from "@/lib/gemini-api"
import { useRouter } from "next/navigation"

// Mock data for initial career paths display
const initialCareerPaths = [
  {
    title: "Web Development",
    description: "Build and maintain websites and web applications",
    roles: [
      { name: "Front-End Developer", salary: "$70,000 - $120,000", skills: ["HTML", "CSS", "JavaScript", "React"] },
      { name: "Back-End Developer", salary: "$80,000 - $130,000", skills: ["Node.js", "Python", "Java", "Databases"] },
      {
        name: "Full-Stack Developer",
        salary: "$90,000 - $140,000",
        skills: ["JavaScript", "React", "Node.js", "Databases"],
      },
    ],
    slug: "web-development",
  },
  {
    title: "Data Science",
    description: "Extract insights and knowledge from structured and unstructured data",
    roles: [
      {
        name: "Data Analyst",
        salary: "$60,000 - $100,000",
        skills: ["SQL", "Excel", "Data Visualization", "Statistics"],
      },
      {
        name: "Data Scientist",
        salary: "$90,000 - $150,000",
        skills: ["Python", "R", "Machine Learning", "Statistics"],
      },
      {
        name: "Machine Learning Engineer",
        salary: "$100,000 - $160,000",
        skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
      },
    ],
    slug: "data-science",
  },
  {
    title: "Design",
    description: "Create visual content to communicate messages and experiences",
    roles: [
      {
        name: "UI Designer",
        salary: "$60,000 - $110,000",
        skills: ["Visual Design", "Typography", "Color Theory", "Figma"],
      },
      {
        name: "UX Designer",
        salary: "$70,000 - $120,000",
        skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
      },
      {
        name: "Product Designer",
        salary: "$80,000 - $140,000",
        skills: ["UI/UX Design", "Design Systems", "User Research", "Prototyping"],
      },
    ],
    slug: "design",
  },
  {
    title: "Digital Marketing",
    description: "Promote brands and products using digital channels",
    roles: [
      {
        name: "SEO Specialist",
        salary: "$50,000 - $90,000",
        skills: ["Keyword Research", "On-Page SEO", "Link Building", "Analytics"],
      },
      {
        name: "Content Marketer",
        salary: "$55,000 - $95,000",
        skills: ["Content Writing", "SEO", "Social Media", "Analytics"],
      },
      {
        name: "Digital Marketing Manager",
        salary: "$70,000 - $130,000",
        skills: ["SEO", "SEM", "Social Media", "Email Marketing"],
      },
    ],
    slug: "digital-marketing",
  },
  {
    title: "Artificial Intelligence",
    description: "Develop systems that can perform tasks that typically require human intelligence",
    roles: [
      {
        name: "AI Research Scientist",
        salary: "$100,000 - $170,000",
        skills: ["Deep Learning", "NLP", "Computer Vision", "Research"],
      },
      { name: "AI Engineer", salary: "$90,000 - $160,000", skills: ["Python", "TensorFlow", "PyTorch", "MLOps"] },
      {
        name: "AI Product Manager",
        salary: "$110,000 - $180,000",
        skills: ["AI Knowledge", "Product Management", "Strategy", "Communication"],
      },
    ],
    slug: "artificial-intelligence",
  },
  {
    title: "Cloud Computing",
    description: "Design, implement, and manage cloud-based systems and infrastructure",
    roles: [
      {
        name: "Cloud Engineer",
        salary: "$80,000 - $130,000",
        skills: ["AWS/Azure/GCP", "IaC", "Networking", "Security"],
      },
      {
        name: "DevOps Engineer",
        salary: "$90,000 - $140,000",
        skills: ["CI/CD", "Docker", "Kubernetes", "Automation"],
      },
      {
        name: "Cloud Architect",
        salary: "$120,000 - $180,000",
        skills: ["Cloud Platforms", "System Design", "Security", "Networking"],
      },
    ],
    slug: "cloud-computing",
  },
]

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [careerPaths, setCareerPaths] = useState(initialCareerPaths)
  const [careerOverview, setCareerOverview] = useState<any>(null)
  const router = useRouter()

  // Handle direct search submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim().length < 2) return

    setIsSearching(true)
    try {
      const API_KEY = "AIzaSyBtgRmkYVpxsCuSpYdYbHJATwAy82Yt1Ds"
      const prompt = `Provide a complete career path for a ${searchQuery} including required skills and certifications. Format the response as JSON with the following structure:
    {
      "title": "Career Title",
      "slug": "career-title-slug",
      "description": "Brief description of the career path",
      "roles": [
        {
          "name": "Role Name",
          "salary": "Salary Range",
          "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
        }
      ]
    }
    Return ONLY the JSON without any additional text or explanation.`

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
            }),
          },
        )

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`)
        }

        const data = await response.json()

        if (
          !data.candidates ||
          !data.candidates[0] ||
          !data.candidates[0].content ||
          !data.candidates[0].content.parts
        ) {
          throw new Error("Invalid API response structure")
        }

        let text = data.candidates[0].content.parts[0].text

        // Clean up the response if it contains markdown code blocks
        if (text.includes("```")) {
          // Extract content between code blocks
          const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
          if (codeBlockMatch && codeBlockMatch[1]) {
            text = codeBlockMatch[1].trim()
          } else {
            // If we can't extract from code blocks, just remove the markdown markers
            text = text
              .replace(/```json\s*/g, "")
              .replace(/```\s*$/g, "")
              .trim()
          }
        }

        const careerData = safeJsonParse(text, {
          title: searchQuery,
          slug: searchQuery.toLowerCase().replace(/\s+/g, "-"),
          description: `Career path for ${searchQuery}`,
        })

        // Navigate to the career path page with the generated data
        router.push(
          `/careers/${careerData.slug || searchQuery.toLowerCase().replace(/\s+/g, "-")}?q=${encodeURIComponent(searchQuery)}`,
        )
      } catch (apiError) {
        console.error("API Error:", apiError)
        // Fallback to simple navigation if API fails
        router.push(`/careers/${searchQuery.toLowerCase().replace(/\s+/g, "-")}?q=${encodeURIComponent(searchQuery)}`)
      }
    } catch (error) {
      console.error("Error searching careers:", error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true)
        try {
          // Get career suggestions
          const suggestionsPrompt = `User is searching for "${searchQuery}" in a career paths database. Return 3 relevant career paths as a JSON array. Each career path should have: title (string), description (short string), and roles (array with 2 job titles). Format as a valid JSON array without any explanation or additional text.`
          const suggestionsResponse = await generateWithGemini(suggestionsPrompt)
          const searchData = safeJsonParse(suggestionsResponse, [])
          setSearchResults(searchData)

          // Get career overview for the first result
          if (searchData.length > 0) {
            const overviewPrompt = `Provide a brief overview of the ${searchQuery} career path. Format the response as JSON with the following structure:
            {
              "overview": "Brief overview of the career",
              "requiredSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
              "certifications": ["Certification 1", "Certification 2"],
              "careerGrowth": "Brief description of career progression"
            }
            Return ONLY the JSON without any additional text or explanation.`

            const overviewResponse = await generateWithGemini(overviewPrompt)
            const overviewData = safeJsonParse(overviewResponse, null)
            setCareerOverview(overviewData)
          } else {
            setCareerOverview(null)
          }
        } catch (error) {
          console.error("Error searching careers:", error)
          setSearchResults([])
          setCareerOverview(null)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setCareerOverview(null)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const getCareerSlug = (career: string) => {
    return career.toLowerCase().replace(/\s+/g, "-")
  }

  const handleExplorePath = (path: any) => {
    router.push(`/careers/${path.slug}?q=${encodeURIComponent(path.title)}`)
  }

  return (
    <main className="container py-12">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Explore Career Paths</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover various career paths and the skills needed to succeed in each role.
        </p>

        <div className="flex justify-center mt-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a career or role (e.g., UX Designer)..."
              className="w-full pl-10 pr-4"
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
                    href={`/careers/${getCareerSlug(result.title)}?q=${encodeURIComponent(result.title)}`}
                    className="block p-3 hover:bg-muted border-b last:border-0"
                  >
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground">{result.description}</div>
                    {result.roles && (
                      <div className="text-xs text-muted-foreground mt-1">Roles: {result.roles.join(", ")}</div>
                    )}
                  </Link>
                ))}

                {careerOverview && (
                  <div className="p-4 border-t">
                    <h3 className="font-medium mb-2">Career Overview: {searchQuery}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{careerOverview.overview}</p>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Required Skills:</h4>
                        <ul className="text-sm space-y-1">
                          {careerOverview.requiredSkills.slice(0, 4).map((skill: string, i: number) => (
                            <li key={i} className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Certifications:</h4>
                        <ul className="text-sm space-y-1">
                          {careerOverview.certifications.slice(0, 2).map((cert: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground">
                              {cert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={(e) => {
                        e.preventDefault()
                        const formattedQuery = searchQuery.toLowerCase().replace(/\s+/g, "-")
                        router.push(`/careers/${formattedQuery}?q=${encodeURIComponent(searchQuery)}`)
                      }}
                    >
                      Explore Complete Path
                    </Button>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careerPaths.map((path, index) => (
          <Card key={index} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{path.title}</CardTitle>
              <CardDescription>{path.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <h3 className="text-sm font-medium">Common Roles:</h3>
              <ul className="space-y-3">
                {path.roles.map((role, i) => (
                  <li key={i} className="text-sm">
                    <div className="font-medium">{role.name}</div>
                    <div className="text-muted-foreground text-xs">{role.salary}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {role.skills.map((skill, j) => (
                        <Badge key={j} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button variant="outline" className="w-full gap-2" onClick={() => handleExplorePath(path)}>
                Explore Path <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
