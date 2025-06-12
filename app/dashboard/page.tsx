"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data for user's learning progress
const userProgress = {
  currentSkills: [
    {
      name: "JavaScript",
      progress: 65,
      level: "Intermediate",
      lastActivity: "2 days ago",
      nextTopic: "Promises and Async/Await",
    },
    {
      name: "UI/UX Design",
      progress: 30,
      level: "Beginner",
      lastActivity: "1 week ago",
      nextTopic: "Wireframing Techniques",
    },
  ],
  completedTopics: [
    {
      skill: "JavaScript",
      topic: "Variables and Data Types",
      completedDate: "2023-05-10",
    },
    {
      skill: "JavaScript",
      topic: "Functions and Scope",
      completedDate: "2023-05-15",
    },
    {
      skill: "JavaScript",
      topic: "Arrays and Objects",
      completedDate: "2023-05-20",
    },
    {
      skill: "UI/UX Design",
      topic: "Design Principles",
      completedDate: "2023-05-25",
    },
  ],
  savedResources: [
    {
      title: "JavaScript Crash Course For Beginners",
      platform: "YouTube",
      url: "https://youtube.com",
      savedDate: "2023-05-05",
    },
    {
      title: "Modern JavaScript From The Beginning",
      platform: "Udemy",
      url: "https://udemy.com",
      savedDate: "2023-05-08",
    },
    {
      title: "UI/UX Design Fundamentals",
      platform: "Coursera",
      url: "https://coursera.org",
      savedDate: "2023-05-12",
    },
  ],
  recommendedSkills: [
    {
      name: "React",
      description: "A JavaScript library for building user interfaces",
      relevance: "Based on your JavaScript progress",
    },
    {
      name: "Figma",
      description: "A collaborative interface design tool",
      relevance: "Based on your UI/UX Design interest",
    },
    {
      name: "Node.js",
      description: "JavaScript runtime for server-side development",
      relevance: "Complements your JavaScript skills",
    },
  ],
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("progress")

  return (
    <main className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and manage your skill journey</p>
        </div>
        <Link href="/skills">
          <Button>Explore New Skills</Button>
        </Link>
      </div>

      <Tabs defaultValue="progress" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProgress.currentSkills.map((skill, index) => (
              <Card key={index} className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{skill.name}</CardTitle>
                      <CardDescription>Level: {skill.level}</CardDescription>
                    </div>
                    <Badge variant="outline">{skill.progress}% Complete</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={skill.progress} className="h-2" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last activity: {skill.lastActivity}</span>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Next up: {skill.nextTopic}</h4>
                      <Link href={`/skills/${skill.name.toLowerCase().replace(/\s+/g, "-")}`}>
                        <Button variant="outline" size="sm" className="mt-2 gap-2">
                          Continue Learning <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="/skills">
              <Button variant="outline">Add a New Skill</Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Topics</CardTitle>
              <CardDescription>Topics you've successfully completed in your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProgress.completedTopics.map((topic, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border-b last:border-0">
                    <CheckCircle className="text-green-500 mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <div className="font-medium">{topic.topic}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline">{topic.skill}</Badge>
                        <span>Completed on {new Date(topic.completedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Resources</CardTitle>
              <CardDescription>Learning materials you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProgress.savedResources.map((resource, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border-b last:border-0">
                    <BookOpen className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Badge variant="secondary">{resource.platform}</Badge>
                        <span>Saved on {new Date(resource.savedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ArrowRight size={16} />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userProgress.recommendedSkills.map((skill, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle>{skill.name}</CardTitle>
                  <CardDescription>{skill.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Why it's recommended:</span> {skill.relevance}
                  </div>
                  <Link href={`/skills/${skill.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button variant="outline" className="w-full gap-2">
                      Explore Skill <ArrowRight size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
