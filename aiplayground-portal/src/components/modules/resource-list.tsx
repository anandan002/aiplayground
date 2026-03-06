import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Video } from "lucide-react"
import type { ModuleResource } from "@prisma/client"
import { EmptyState } from "@/components/common/empty-state"

interface ResourceListProps {
  resources: ModuleResource[]
}

function isYouTubeUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

export function ResourceList({ resources }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <EmptyState
        icon="book"
        title="No resources yet"
        description="Resources for this module will be added soon."
      />
    )
  }

  return (
    <div className="space-y-3">
      {resources.map((resource) => {
        const youtubeId =
          resource.type === "VIDEO" ? isYouTubeUrl(resource.url) : null

        return (
          <Card key={resource.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {resource.type === "VIDEO" ? (
                    <Video className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  ) : (
                    <ExternalLink className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-indigo-600 hover:underline transition-colors"
                    >
                      {resource.title}
                    </a>
                  </div>
                </div>
                <Badge
                  variant={resource.type === "VIDEO" ? "destructive" : "secondary"}
                  className="shrink-0 text-xs"
                >
                  {resource.type}
                </Badge>
              </div>
              {youtubeId && (
                <div className="mt-3 aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={resource.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
