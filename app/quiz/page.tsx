"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowRight, CheckCircle, Code, PenTool, BarChart3, Megaphone, Brain, Database } from "lucide-react"
import Link from "next/link"
import { generateWithGemini } from "@/lib/gemini-api"

interface Question {
  id: number
  text: string
  options: {
    id: string
    text: string
    category: string
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "When working on a project, do you prefer:",
    options: [
      { id: "1a", text: "Building and creating things from scratch", category: "programming" },
      { id: "1b", text: "Making things look visually appealing", category: "design" },
      { id: "1c", text: "Analyzing information and finding patterns", category: "data" },
      { id: "1d", text: "Communicating ideas and persuading others", category: "marketing" },
    ],
  },
  {
    id: 2,
    text: "Which of these activities sounds most interesting to you?",
    options: [
      { id: "2a", text: "Solving complex logical problems", category: "programming" },
      { id: "2b", text: "Creating visual content that tells a story", category: "design" },
      { id: "2c", text: "Working with numbers and statistics", category: "data" },
      { id: "2d", text: "Crafting messages that resonate with people", category: "marketing" },
    ],
  },
  {
    id: 3,
    text: "What type of tools would you most enjoy working with?",
    options: [
      { id: "3a", text: "Code editors and development frameworks", category: "programming" },
      { id: "3b", text: "Design software and creative tools", category: "design" },
      { id: "3c", text: "Data analysis and visualization tools", category: "data" },
      { id: "3d", text: "Content management and social media platforms", category: "marketing" },
    ],
  },
  {
    id: 4,
    text: "In a team project, which role would you naturally gravitate towards?",
    options: [
      { id: "4a", text: "The technical implementer who builds the solution", category: "programming" },
      { id: "4b", text: "The creative who focuses on user experience and aesthetics", category: "design" },
      { id: "4c", text: "The analyst who researches and provides insights", category: "data" },
      { id: "4d", text: "The communicator who presents ideas and engages stakeholders", category: "marketing" },
    ],
  },
  {
    id: 5,
    text: "Which of these outcomes would give you the most satisfaction?",
    options: [
      { id: "5a", text: "Building a functional application that solves a problem", category: "programming" },
      { id: "5b", text: "Creating a beautiful and intuitive interface", category: "design" },
      { id: "5c", text: "Uncovering insights that lead to better decisions", category: "data" },
      { id: "5d", text: "Crafting a message that effectively reaches an audience", category: "marketing" },
    ],
  },
]

const categoryIcons = {
  programming: <Code className="h-10 w-10 text-primary" />,
  design: <PenTool className="h-10 w-10 text-primary" />,
  data: <BarChart3 className="h-10 w-10 text-primary" />,
  marketing: <Megaphone className="h-10 w-10 text-primary" />,
  "ai-ml": <Brain className="h-10 w-10 text-primary" />,
  database: <Database className="h-10 w-10 text-primary" />,
}

const categoryDescriptions = {
  programming:
    "You have an aptitude for logical thinking and problem-solving. Programming skills would be a great fit for you.",
  design:
    "You have a creative eye and care about aesthetics and user experience. Design skills would be a great match for you.",
  data: "You enjoy working with information and finding patterns. Data analysis skills would be perfect for your analytical mind.",
  marketing:
    "You're a natural communicator who understands what resonates with people. Marketing skills would leverage your strengths.",
  "ai-ml": "Your combination of technical and analytical thinking makes you well-suited for AI and machine learning.",
  database: "Your structured thinking and attention to detail make database skills a good match for you.",
}

export default function SkillQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resultData, setResultData] = useState<any>(null)

  const handleAnswer = (questionId: number, categoryId: string) => {
    setAnswers({ ...answers, [questionId]: categoryId })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult()
    }
  }

  const calculateResult = async () => {
    setIsLoading(true)

    try {
      // Format the answers for the Gemini API
      const userAnswers = questions.map((question) => {
        const answerId = answers[question.id]
        const selectedOption = question.options.find((option) => option.category === answerId)
        return {
          question: question.text,
          answer: selectedOption ? selectedOption.text : "Not answered",
        }
      })

      const prompt = `Based on these quiz answers about career preferences, recommend ONE best skill category (choose from: programming, design, data, marketing, ai-ml, database) and explain why it's a good fit. Also suggest 3-4 specific skills within that category to learn. Format as JSON with fields: category (string), explanation (string), and recommendedSkills (array of strings). Quiz answers: ${JSON.stringify(userAnswers)}`

      // Assuming generateWithGemini is defined elsewhere and accessible
      const response = await generateWithGemini(prompt)
      // const response = '{"category": "programming", "explanation": "Based on your answers, you seem to enjoy solving problems and building things, which aligns well with programming.", "recommendedSkills": ["JavaScript", "Python", "React", "Node.js"]}';

      // Parse the JSON response
      const resultData = JSON.parse(response)
      setResultData(resultData)
      setResult(resultData.category)
    } catch (error) {
      console.error("Error generating quiz result:", error)
      // Fallback to the original category counting method
      const categories: Record<string, number> = {}

      Object.values(answers).forEach((category) => {
        categories[category] = (categories[category] || 0) + 1
      })

      let maxCount = 0
      let resultCategory = ""

      Object.entries(categories).forEach(([category, count]) => {
        if (count > maxCount) {
          maxCount = count
          resultCategory = category
        }
      })

      setResult(resultCategory)
    } finally {
      setIsLoading(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
    setResultData(null)
  }

  if (result) {
    return (
      <main className="container py-12 max-w-3xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Recommended Skill Path</CardTitle>
            <CardDescription>Based on your answers, we think this would be a great fit for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="bg-primary/10 p-6 rounded-full">
                      {categoryIcons[result as keyof typeof categoryIcons]}
                    </div>
                    <h3 className="text-2xl font-bold">{result.charAt(0).toUpperCase() + result.slice(1)}</h3>
                    <p className="text-center text-muted-foreground max-w-md">
                      {resultData?.explanation || categoryDescriptions[result as keyof typeof categoryDescriptions]}
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Recommended skills to learn:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {resultData?.recommendedSkills ? (
                        resultData.recommendedSkills.map((skill: string, index: number) => (
                          <Link
                            key={index}
                            href={`/skills/${result}/${skill.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> {skill}
                          </Link>
                        ))
                      ) : (
                        <>
                          {result === "programming" && (
                            <>
                              <Link
                                href="/skills/programming/javascript"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> JavaScript
                              </Link>
                              <Link
                                href="/skills/programming/python"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Python
                              </Link>
                              <Link
                                href="/skills/programming/react"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> React
                              </Link>
                              <Link
                                href="/skills/programming/java"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Java
                              </Link>
                            </>
                          )}
                          {result === "design" && (
                            <>
                              <Link
                                href="/skills/design/ui-ux-design"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> UI/UX Design
                              </Link>
                              <Link
                                href="/skills/design/graphic-design"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Graphic Design
                              </Link>
                              <Link
                                href="/skills/design/figma"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Figma
                              </Link>
                              <Link
                                href="/skills/design/web-design"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Web Design
                              </Link>
                            </>
                          )}
                          {result === "data" && (
                            <>
                              <Link
                                href="/skills/data/data-analysis"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Data Analysis
                              </Link>
                              <Link
                                href="/skills/data/machine-learning"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Machine Learning
                              </Link>
                              <Link
                                href="/skills/data/sql"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> SQL
                              </Link>
                              <Link
                                href="/skills/data/data-visualization"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Data Visualization
                              </Link>
                            </>
                          )}
                          {result === "marketing" && (
                            <>
                              <Link
                                href="/skills/marketing/seo"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> SEO
                              </Link>
                              <Link
                                href="/skills/marketing/content-writing"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Content Writing
                              </Link>
                              <Link
                                href="/skills/marketing/social-media-marketing"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Social Media Marketing
                              </Link>
                              <Link
                                href="/skills/marketing/email-marketing"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <CheckCircle size={16} /> Email Marketing
                              </Link>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={resetQuiz} className="flex-1">
              Retake Quiz
            </Button>
            <Link href={`/skills/${result}`} className="flex-1 w-full sm:w-auto">
              <Button className="w-full gap-2">
                Explore {result.charAt(0).toUpperCase() + result.slice(1)} Skills
                <ArrowRight size={16} />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className="container py-12 max-w-3xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Skill Recommendation Quiz</CardTitle>
          <CardDescription>
            Answer a few questions to discover which skills might be the best fit for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2 text-sm">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-medium">{questions[currentQuestion].text}</h3>

            <RadioGroup
              value={answers[questions[currentQuestion].id] || ""}
              onValueChange={(value) => handleAnswer(questions[currentQuestion].id, value)}
            >
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.category} id={option.id} className="peer" />
                    <Label
                      htmlFor={option.id}
                      className="flex-1 p-3 -ml-6 pl-10 border rounded-md peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!answers[questions[currentQuestion].id]} className="gap-2">
            {currentQuestion < questions.length - 1 ? "Next" : "See Results"}
            <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
