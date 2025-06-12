"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Briefcase, BadgeIcon as Certificate, Clock, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { safeJsonParse } from "@/lib/gemini-api"

// Fallback data in case API fails
const fallbackData = {
  overview: "This career path involves designing, developing, and maintaining software applications and systems.",
  skills: ["JavaScript", "HTML/CSS", "React", "Node.js", "Git", "Problem Solving", "Communication", "Teamwork"],
  certifications: [
    {
      name: "AWS Certified Developer",
      description: "Validates technical expertise in developing and maintaining applications on AWS",
    },
    {
      name: "Microsoft Certified: Azure Developer Associate",
      description: "Demonstrates proficiency in cloud development using Microsoft Azure",
    },
    {
      name: "Google Professional Cloud Developer",
      description: "Validates ability to build scalable applications using Google Cloud",
    },
  ],
  roadmap: [
    {
      title: "Entry Level Developer",
      description: "Focus on building fundamental programming skills and understanding software development lifecycle",
      timeframe: "1-2 years",
    },
    {
      title: "Mid-Level Developer",
      description: "Take on more complex projects and begin to specialize in specific technologies or domains",
      timeframe: "2-4 years",
    },
    {
      title: "Senior Developer",
      description: "Lead development efforts, mentor junior developers, and make architectural decisions",
      timeframe: "4-8 years",
    },
    {
      title: "Technical Lead / Architect",
      description: "Design system architecture, make technology decisions, and oversee multiple projects",
      timeframe: "8+ years",
    },
  ],
  salaryRanges: [
    {
      level: "Entry Level",
      range: "$60,000 - $85,000",
    },
    {
      level: "Mid-Level",
      range: "$85,000 - $120,000",
    },
    {
      level: "Senior Level",
      range: "$120,000 - $160,000",
    },
    {
      level: "Lead / Architect",
      range: "$150,000 - $200,000+",
    },
  ],
}

export default function CareerPathPage({ params }: { params: { path: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [careerData, setCareerData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tabContent, setTabContent] = useState<Record<string, any>>({
    overview: null,
    skills: null,
    certifications: null,
    roadmap: null,
  })
  const [isTabLoading, setIsTabLoading] = useState<Record<string, boolean>>({
    overview: false,
    skills: false,
    certifications: false,
    roadmap: false,
  })

  const searchParams = useSearchParams()
  const queryParam = searchParams?.get("q")

  // Format the path name for display
  const pathName =
    queryParam ||
    params.path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  useEffect(() => {
    const fetchCareerData = async () => {
      console.log("Fetching career data for path:", pathName)
      setIsLoading(true)
      setError(null)

      try {
        // Format the career path for the prompt
        const careerPath = pathName
        const API_KEY = "AIzaSyBtgRmkYVpxsCuSpYdYbHJATwAy82Yt1Ds"

        const prompt = `Provide a complete career path for a ${careerPath} including required skills and certifications. Format the response as JSON with the following structure:
        {
          "overview": "Brief description of the field",
          "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
          "certifications": [
            {
              "name": "Certification Name",
              "description": "Brief description of the certification"
            }
          ],
          "roadmap": [
            {
              "title": "Step Title",
              "description": "Description of this career step",
              "timeframe": "Estimated timeframe"
            }
          ],
          "salaryRanges": [
            {
              "level": "Career Level",
              "range": "Salary Range"
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
          setCareerData(parsedData)
          setTabContent({
            ...tabContent,
            overview: parsedData,
          })
        } catch (apiError) {
          console.error("API Error:", apiError)
          // Use fallback data if API fails
          setCareerData(fallbackData)
          setTabContent({
            ...tabContent,
            overview: fallbackData,
          })
          setError("Could not fetch data from API. Using fallback data.")
        }
      } catch (error) {
        console.error("Error fetching career data:", error)
        console.error("Error details:", JSON.stringify(error, null, 2))
        setError("Failed to load career path data. Using fallback data.")
        // Use fallback data
        setCareerData(fallbackData)
        setTabContent({
          ...tabContent,
          overview: fallbackData,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCareerData()
  }, [pathName])

  const fetchTabContent = async (tab: string) => {
    if (tabContent[tab]) return // Already loaded

    setIsTabLoading({ ...isTabLoading, [tab]: true })
    const API_KEY = "AIzaSyBtgRmkYVpxsCuSpYdYbHJATwAy82Yt1Ds"

    try {
      let prompt = ""

      switch (tab) {
        case "overview":
          prompt = `Give a detailed overview of the ${pathName} career. Format the response as JSON with the following structure:
        {
          "overview": "Detailed description of the career",
          "salaryRanges": [
            {
              "level": "Career Level",
              "range": "Salary Range"
            }
          ]
        }
        Return ONLY the JSON without any additional text or explanation.`
          break

        case "skills":
          prompt = `What are the essential skills needed for a ${pathName}? Format the response as JSON with the following structure:
        {
          "technicalSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
          "softSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
          "recommendedLearningPaths": [
            {
              "name": "Learning Path Name",
              "description": "Brief description"
            }
          ]
        }
        Return ONLY the JSON without any additional text or explanation.`
          break

        case "certifications":
          prompt = `What certifications are recommended for a ${pathName}? Format the response as JSON with the following structure:
        {
          "certifications": [
            {
              "name": "Certification Name",
              "description": "Detailed description of the certification",
              "difficulty": "Beginner/Intermediate/Advanced",
              "provider": "Organization that offers this certification"
            }
          ]
        }
        Return ONLY the JSON without any additional text or explanation.`
          break

        case "roadmap":
          prompt = `Show a step-by-step roadmap to become a ${pathName}. Format the response as JSON with the following structure:
        {
          "roadmap": [
            {
              "title": "Step Title",
              "description": "Detailed description of this career step",
              "timeframe": "Estimated timeframe",
              "keySkills": ["Skill 1", "Skill 2"],
              "milestones": ["Milestone 1", "Milestone 2"]
            }
          ]
        }
        Include at least 5 steps in the roadmap. Return ONLY the JSON without any additional text or explanation.`
          break
      }

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

        const parsedData = safeJsonParse(text, {})
        setTabContent({
          ...tabContent,
          [tab]: parsedData,
        })
      } catch (apiError) {
        console.error(`API Error for ${tab}:`, apiError)
        // Use fallback data based on the tab
        if (tab === "skills") {
          setTabContent({
            ...tabContent,
            [tab]: {
              technicalSkills: careerData?.skills?.slice(0, Math.ceil(careerData?.skills?.length / 2)) || [],
              softSkills: careerData?.skills?.slice(Math.ceil(careerData?.skills?.length / 2)) || [],
            },
          })
        } else if (tab === "certifications") {
          setTabContent({
            ...tabContent,
            [tab]: { certifications: careerData?.certifications || [] },
          })
        } else if (tab === "roadmap") {
          setTabContent({
            ...tabContent,
            [tab]: { roadmap: careerData?.roadmap || [] },
          })
        }
      }
    } catch (error) {
      console.error(`Error fetching ${tab} data:`, error)
    } finally {
      setIsTabLoading({ ...isTabLoading, [tab]: false })
    }
  }

  useEffect(() => {
    if (activeTab && !tabContent[activeTab] && !isTabLoading[activeTab]) {
      fetchTabContent(activeTab)
    }
  }, [activeTab])

  const handleViewRoadmap = async () => {
    setActiveTab("roadmap")
    if (!tabContent.roadmap) {
      await fetchTabContent("roadmap")
    }
  }

  // If we have an error but also have fallback data, we can still render the page
  if (isLoading) {
    return (
      <main className="container py-12">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading career path information...</p>
          </div>
        </div>
      </main>
    )
  }

  // Use the data we have (either from API or fallback)
  const data = careerData || fallbackData

  return (
    <main className="container py-12">
      {error && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{pathName}</h1>
        <p className="text-xl text-muted-foreground">{data.overview}</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Required Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="roadmap">Career Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isTabLoading.overview ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>About {pathName}</CardTitle>
                <CardDescription>Overview of this career path and what to expect</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>{tabContent.overview?.overview || data.overview}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" /> Salary Expectations
                    </h3>
                    <ul className="space-y-3">
                      {(tabContent.overview?.salaryRanges || data.salaryRanges || []).map(
                        (salary: any, index: number) => (
                          <li key={index} className="flex justify-between items-center text-sm">
                            <span>{salary.level}</span>
                            <Badge variant="outline">{salary.range}</Badge>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" /> Career Timeline
                    </h3>
                    <ul className="space-y-3">
                      {(tabContent.overview?.roadmap || data.roadmap || []).map((step: any, index: number) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                          <span>{step.title}</span>
                          <Badge variant="secondary">{step.timeframe}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button onClick={handleViewRoadmap} className="gap-2">
                    View Detailed Roadmap <ArrowRight size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          {isTabLoading.skills ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
                <CardDescription>Key skills needed to succeed as a {pathName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Technical Skills</h3>
                    <ul className="space-y-3">
                      {(
                        tabContent.skills?.technicalSkills ||
                        data.skills?.slice(0, Math.ceil(data.skills?.length / 2)) ||
                        []
                      ).map((skill: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">{skill}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Soft Skills</h3>
                    <ul className="space-y-3">
                      {(
                        tabContent.skills?.softSkills ||
                        data.skills?.slice(Math.ceil(data.skills?.length / 2)) ||
                        []
                      ).map((skill: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">{skill}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Recommended Learning Paths</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(tabContent.skills?.recommendedLearningPaths || []).map((path: any, index: number) => (
                      <Card key={index} className="h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{path.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{path.description}</p>
                          <Button variant="outline" className="w-full mt-4 gap-2">
                            <BookOpen className="h-4 w-4" />
                            Explore Path
                          </Button>
                        </CardContent>
                      </Card>
                    ))}

                    {!tabContent.skills?.recommendedLearningPaths &&
                      data.skills?.slice(0, 3).map((skill: string, index: number) => (
                        <Link key={index} href={`/skills/search?q=${encodeURIComponent(skill)}`} className="block">
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <BookOpen className="h-4 w-4" />
                            Learn {skill}
                          </Button>
                        </Link>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          {isTabLoading.certifications ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Certifications</CardTitle>
                <CardDescription>
                  Professional certifications that can advance your career as a {pathName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(tabContent.certifications?.certifications || data.certifications || []).map(
                    (cert: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Certificate className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{cert.name}</h3>
                              {cert.difficulty && <Badge variant="outline">{cert.difficulty}</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{cert.description}</p>
                            {cert.provider && (
                              <p className="text-xs text-muted-foreground mt-2">Provider: {cert.provider}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          {isTabLoading.roadmap ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Career Progression Roadmap</CardTitle>
                <CardDescription>Step-by-step guide to advancing as a {pathName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-8">
                    {(tabContent.roadmap?.roadmap || data.roadmap || []).map((step: any, index: number) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">{index + 1}</span>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-lg">{step.title}</h3>
                            <Badge variant="outline">{step.timeframe}</Badge>
                          </div>
                          <p className="text-muted-foreground">{step.description}</p>

                          {step.keySkills && step.keySkills.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Key Skills:</h4>
                              <div className="flex flex-wrap gap-2">
                                {step.keySkills.map((skill: string, i: number) => (
                                  <Badge key={i} variant="secondary">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {step.milestones && step.milestones.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Milestones:</h4>
                              <ul className="text-sm space-y-1">
                                {step.milestones.map((milestone: string, i: number) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <ArrowRight className="h-3 w-3 text-primary" />
                                    <span>{milestone}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {!step.keySkills &&
                            !step.milestones &&
                            index < (tabContent.roadmap?.roadmap || data.roadmap || []).length - 1 && (
                              <div className="mt-4 pt-4 border-t">
                                <h4 className="text-sm font-medium mb-2">To advance to the next level:</h4>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-center gap-2">
                                    <ArrowRight className="h-3 w-3 text-primary" />
                                    <span>
                                      Gain experience in{" "}
                                      {data.skills?.[index % data.skills?.length] || "relevant skills"}
                                    </span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <ArrowRight className="h-3 w-3 text-primary" />
                                    <span>
                                      Consider obtaining{" "}
                                      {data.certifications?.[index % data.certifications?.length]?.name ||
                                        "relevant certifications"}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
