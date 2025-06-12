"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Code, ExternalLink, Loader2 } from "lucide-react"
import ResourceCard from "@/components/resource-card"
import ProjectCard from "@/components/project-card"
import CareerPathSection from "@/components/career-path-section"
import { fetchYouTubeVideos } from "@/lib/youtube-api"
import { useSearchParams } from "next/navigation"
import { safeJsonParse } from "@/lib/gemini-api"

// Mock data for when API fails
const fallbackData = {
  title: "JavaScript",
  description: "A versatile programming language for web development",
  levels: [
    {
      title: "Beginner",
      estimatedTime: "40-60 hours",
      topics: [
        "JavaScript Basics and Syntax",
        "Variables and Data Types",
        "Functions and Scope",
        "Arrays and Objects",
        "DOM Manipulation",
        "Event Handling",
      ],
      project: {
        title: "Interactive Form Validator",
        description: "Build a form with client-side validation using JavaScript",
        tools: ["HTML", "CSS", "JavaScript"],
        estimatedTime: "8-10 hours",
      },
    },
    {
      title: "Intermediate",
      estimatedTime: "80-100 hours",
      topics: [
        "ES6+ Features",
        "Asynchronous JavaScript",
        "Promises and Async/Await",
        "Fetch API and AJAX",
        "Error Handling",
        "JavaScript Modules",
      ],
      project: {
        title: "Weather Dashboard App",
        description: "Create a weather app that fetches data from a public API",
        tools: ["HTML", "CSS", "JavaScript", "Weather API"],
        estimatedTime: "15-20 hours",
      },
    },
    {
      title: "Advanced",
      estimatedTime: "120-150 hours",
      topics: [
        "Design Patterns",
        "Functional Programming",
        "Performance Optimization",
        "Testing and Debugging",
        "Web Components",
        "JavaScript Frameworks",
      ],
      project: {
        title: "Single Page Application",
        description: "Build a complete SPA with routing and state management",
        tools: ["JavaScript", "Custom Router", "State Management"],
        estimatedTime: "25-30 hours",
      },
    },
  ],
  capstoneProject: {
    title: "Full-Stack JavaScript Application",
    description: "Develop a complete web application with frontend and backend JavaScript",
    tools: ["Node.js", "Express", "MongoDB", "React/Vue/Angular", "REST API"],
    estimatedTime: "40-60 hours",
  },
  careers: [
    {
      title: "Front-End Developer",
      skills: ["JavaScript", "HTML", "CSS", "React/Vue/Angular", "Git"],
      salaryRange: "$70,000 - $120,000",
      responsibilities: [
        "Build user interfaces using JavaScript and frameworks",
        "Implement responsive designs",
        "Optimize application performance",
        "Collaborate with designers and back-end developers",
      ],
      growthPath: "Senior Front-End Developer → Lead Developer → Front-End Architect",
    },
    {
      title: "Full-Stack JavaScript Developer",
      skills: ["JavaScript", "Node.js", "Express", "MongoDB/SQL", "React/Vue/Angular"],
      salaryRange: "$80,000 - $140,000",
      responsibilities: [
        "Develop both client and server-side applications",
        "Design and implement databases",
        "Create RESTful APIs",
        "Deploy and maintain web applications",
      ],
      growthPath: "Senior Full-Stack Developer → Technical Lead → Solution Architect",
    },
    {
      title: "JavaScript Framework Specialist",
      skills: ["JavaScript", "React/Vue/Angular", "State Management", "Testing", "Performance Optimization"],
      salaryRange: "$90,000 - $150,000",
      responsibilities: [
        "Build complex applications using specific frameworks",
        "Implement state management solutions",
        "Create reusable components and libraries",
        "Mentor junior developers on framework best practices",
      ],
      growthPath: "Senior Framework Developer → Framework Architect → Technical Director",
    },
  ],
}

export default function SkillRoadmapPage({ params }: { params: { category: string; skill: string } }) {
  const [activeTab, setActiveTab] = useState("roadmap")
  const [resources, setResources] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [skillData, setSkillData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const queryParam = searchParams?.get("q")

  // Format the skill name for display
  const skillName =
    queryParam ||
    params.skill
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  // Format the category name for display
  const categoryName = params.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  useEffect(() => {
    const fetchSkillData = async () => {
      console.log("Fetching skill data for:", skillName, categoryName)
      setIsLoading(true)
      try {
        // Generate skill roadmap data using Gemini API
        const API_KEY = "AIzaSyBtgRmkYVpxsCuSpYdYbHJATwAy82Yt1Ds"
        const prompt = `Create a comprehensive learning roadmap for ${skillName} in the ${categoryName} field. Format the response as JSON with the following structure:
    {
      "title": "${skillName}",
      "description": "Brief description of the skill",
      "levels": [
        {
          "title": "Beginner",
          "estimatedTime": "Estimated hours",
          "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6"],
          "project": {
            "title": "Project title",
            "description": "Project description",
            "tools": ["Tool 1", "Tool 2", "Tool 3"],
            "estimatedTime": "Estimated hours"
          }
        },
        {
          "title": "Intermediate",
          "estimatedTime": "Estimated hours",
          "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6"],
          "project": {
            "title": "Project title",
            "description": "Project description",
            "tools": ["Tool 1", "Tool 2", "Tool 3"],
            "estimatedTime": "Estimated hours"
          }
        },
        {
          "title": "Advanced",
          "estimatedTime": "Estimated hours",
          "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6"],
          "project": {
            "title": "Project title",
            "description": "Project description",
            "tools": ["Tool 1", "Tool 2", "Tool 3"],
            "estimatedTime": "Estimated hours"
          }
        }
      ],
      "capstoneProject": {
        "title": "Capstone project title",
        "description": "Comprehensive description",
        "tools": ["Tool 1", "Tool 2", "Tool 3", "Tool 4", "Tool 5"],
        "estimatedTime": "Estimated hours"
      },
      "careers": [
        {
          "title": "Career title 1",
          "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
          "salaryRange": "Salary range",
          "responsibilities": ["Responsibility 1", "Responsibility 2", "Responsibility 3", "Responsibility 4"],
          "growthPath": "Career progression path"
        },
        {
          "title": "Career title 2",
          "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
          "salaryRange": "Salary range",
          "responsibilities": ["Responsibility 1", "Responsibility 2", "Responsibility 3", "Responsibility 4"],
          "growthPath": "Career progression path"
        },
        {
          "title": "Career title 3",
          "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
          "salaryRange": "Salary range",
          "responsibilities": ["Responsibility 1", "Responsibility 2", "Responsibility 3", "Responsibility 4"],
          "growthPath": "Career progression path"
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

          const parsedData = safeJsonParse(text, fallbackData)
          setSkillData(parsedData)

          // For each level, fetch resources for the first topic
          const allResources = []

          for (const level of parsedData.levels) {
            if (level.topics && level.topics.length > 0) {
              try {
                const query = `${parsedData.title} ${level.topics[0]} tutorial`
                const videos = await fetchYouTubeVideos(query, 2)

                allResources.push({
                  level: level.title,
                  topic: level.topics[0],
                  resources: videos.map((video: any) => ({
                    title: video.snippet.title,
                    description: video.snippet.description,
                    thumbnail: video.snippet.thumbnails.medium.url,
                    url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                    platform: "YouTube",
                    duration: "10-15 min", // YouTube API doesn't provide duration in search results
                  })),
                })
              } catch (error) {
                console.error("Error fetching YouTube videos:", error)
              }
            }
          }

          setResources(allResources)
        } catch (apiError) {
          console.error("API Error:", apiError)
          // Use fallback data if API fails
          setSkillData(fallbackData)

          // Create fallback resources
          const fallbackResources = [
            {
              level: "Beginner",
              topic: "JavaScript Basics and Syntax",
              resources: [
                {
                  title: "JavaScript Crash Course For Beginners",
                  description: "Learn JavaScript in 1 hour with this crash course for beginners",
                  thumbnail: "https://i.ytimg.com/vi/hdI2bqOjy3c/mqdefault.jpg",
                  url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
                  platform: "YouTube",
                  duration: "10-15 min",
                },
                {
                  title: "JavaScript Tutorial for Beginners",
                  description: "Complete JavaScript tutorial for beginners covering all the basics",
                  thumbnail: "https://i.ytimg.com/vi/W6NZfCO5SIk/mqdefault.jpg",
                  url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
                  platform: "YouTube",
                  duration: "10-15 min",
                },
              ],
            },
          ]
          setResources(fallbackResources)
          setError("Could not fetch data from API. Using fallback data.")
        }
      } catch (error) {
        console.error("Error fetching skill data:", error)
        console.error("Error details:", JSON.stringify(error, null, 2))
        setError("Failed to load skill data. Using fallback data.")
        // Use fallback data
        setSkillData(fallbackData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkillData()
  }, [skillName, categoryName])

  if (isLoading) {
    return (
      <main className="container py-12">
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating your personalized roadmap...</p>
          </div>
        </div>
      </main>
    )
  }

  // If we have an error but also have fallback data, we can still render the page
  if (!skillData && !fallbackData) {
    return (
      <main className="container py-12">
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground">
              We couldn't find the skill roadmap you're looking for. Please try another skill.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </main>
    )
  }

  // Use the data we have (either from API or fallback)
  const data = skillData || fallbackData

  return (
    <main className="container py-12">
      {error && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight">{data.title}</h1>
          <Badge variant="outline" className="text-sm font-normal">
            {params.category}
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">{data.description}</p>
      </div>

      <Tabs defaultValue="roadmap" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="careers">Career Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.levels.map((level: any, index: number) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                      {level.title}
                    </Badge>
                    <span className="text-muted-foreground text-sm font-normal flex items-center gap-1">
                      <Clock size={14} /> {level.estimatedTime}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Master these topics to reach {level.title.toLowerCase()} proficiency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <BookOpen size={16} /> Topics to Learn
                    </h4>
                    <ul className="space-y-2">
                      {level.topics.map((topic: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                            {i + 1}
                          </span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Code size={16} /> Mini Project
                    </h4>
                    <ProjectCard project={level.project} />
                  </div>

                  <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab("resources")}>
                    View Resources
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4">Capstone Project</h3>
            <Card>
              <CardHeader>
                <CardTitle>{data.capstoneProject.title}</CardTitle>
                <CardDescription>{data.capstoneProject.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.capstoneProject.tools.map((tool: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tool}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={16} />
                  <span>Estimated time: {data.capstoneProject.estimatedTime}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-8">
          {resources.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading resources...</p>
              </div>
            </div>
          ) : (
            resources.map((resourceGroup, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-2xl font-bold">
                  {resourceGroup.level}: {resourceGroup.topic}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resourceGroup.resources.map((resource: any, i: number) => (
                    <ResourceCard key={i} resource={resource} />
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="flex justify-center mt-8">
            <Button variant="outline" className="gap-2">
              <ExternalLink size={16} />
              View More Resources
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="careers" className="space-y-8">
          <h3 className="text-2xl font-bold mb-4">Career Paths with {data.title}</h3>
          <CareerPathSection careers={data.careers} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
