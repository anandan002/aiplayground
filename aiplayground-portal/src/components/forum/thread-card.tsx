import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Pin } from "lucide-react"
import type { ThreadWithMeta } from "@/types"

interface ThreadCardProps {
  thread: ThreadWithMeta
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const lastActivity =
    thread.posts.length > 0 ? thread.posts[0].createdAt : thread.createdAt

  return (
    <Link href={`/forum/${thread.id}`}>
      <Card className="transition-all hover:shadow-sm hover:border-indigo-200 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                {thread.pinned && (
                  <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                )}
                <h3 className="text-sm font-medium truncate">
                  {thread.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{thread.user.name}</span>
                <span>&middot;</span>
                {thread.module ? (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {thread.module.title}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    General
                  </Badge>
                )}
                <span>&middot;</span>
                <span>{timeAgo(lastActivity)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="text-xs">{thread._count.posts}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
