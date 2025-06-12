import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface ProjectCardProps {
  project: {
    title: string
    description: string
    tools: string[]
    estimatedTime: string
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="space-y-2 p-3 border rounded-md bg-muted/30">
      <h4 className="font-medium">{project.title}</h4>
      <p className="text-sm text-muted-foreground">{project.description}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {project.tools.map((tool, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {tool}
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
        <Clock size={12} />
        <span>Estimated time: {project.estimatedTime}</span>
      </div>
    </div>
  )
}
