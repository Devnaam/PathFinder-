import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink, Youtube, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResourceCardProps {
  resource: {
    title: string
    description: string
    thumbnail: string
    url: string
    platform: string
    duration: string
  }
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return <Youtube size={16} />
      default:
        return <Globe size={16} />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "coursera":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "udemy":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={resource.thumbnail || "/placeholder.svg"}
          alt={resource.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge className={`flex items-center gap-1 ${getPlatformColor(resource.platform)}`}>
            {getPlatformIcon(resource.platform)}
            {resource.platform}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock size={12} /> {resource.duration}
          </span>
        </div>
        <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-2">
        <Button asChild className="w-full gap-2">
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} /> Open Resource
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
