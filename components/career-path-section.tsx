import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, CheckCircle } from "lucide-react"

interface Career {
  title: string
  skills: string[]
  salaryRange: string
  responsibilities: string[]
  growthPath: string
}

interface CareerPathSectionProps {
  careers: Career[]
}

export default function CareerPathSection({ careers }: CareerPathSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {careers.map((career, index) => (
        <Card key={index} className="h-full">
          <CardHeader>
            <CardTitle>{career.title}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <DollarSign size={16} className="text-green-500" />
                <span>{career.salaryRange}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Responsibilities</h4>
              <ul className="space-y-2">
                {career.responsibilities.map((responsibility, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Growth Path</h4>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-primary shrink-0" />
                <span>{career.growthPath}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
