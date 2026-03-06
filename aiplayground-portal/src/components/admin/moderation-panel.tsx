"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pin, PinOff, MessageSquare } from "lucide-react"
import { ConfirmDialog } from "@/components/common/confirm-dialog"

type ThreadData = {
  id: string
  title: string
  pinned: boolean
  createdAt: string
  user: { id: string; name: string }
  module: { title: string; slug: string } | null
  _count: { posts: number }
}

interface ModerationPanelProps {
  threads: ThreadData[]
  onPinToggle: (threadId: string) => Promise<void>
  onDeletePost: (postId: string) => Promise<void>
}

export function ModerationPanel({
  threads,
  onPinToggle,
}: ModerationPanelProps) {
  const [filterModule, setFilterModule] = useState<string>("all")
  const [confirmPin, setConfirmPin] = useState<string | null>(null)

  const uniqueModules = Array.from(
    new Map(
      threads
        .filter((t) => t.module)
        .map((t) => [t.module!.slug, t.module!])
    ).values()
  )

  const filteredThreads = threads.filter((t) => {
    if (filterModule === "all") return true
    if (filterModule === "general") return !t.module
    return t.module?.slug === filterModule
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterModule === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterModule("all")}
        >
          All
        </Button>
        <Button
          variant={filterModule === "general" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterModule("general")}
        >
          General
        </Button>
        {uniqueModules.map((mod) => (
          <Button
            key={mod.slug}
            variant={filterModule === mod.slug ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterModule(mod.slug)}
          >
            {mod.title}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Threads ({filteredThreads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredThreads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No threads found.</p>
          ) : (
            <div className="space-y-2">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      {thread.pinned && (
                        <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {thread.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{thread.user.name}</span>
                      <span>&middot;</span>
                      {thread.module ? (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0"
                        >
                          {thread.module.title}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0"
                        >
                          General
                        </Badge>
                      )}
                      <span>&middot;</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {thread._count.posts}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setConfirmPin(thread.id)}
                  >
                    {thread.pinned ? (
                      <>
                        <PinOff className="h-3.5 w-3.5 mr-1" />
                        Unpin
                      </>
                    ) : (
                      <>
                        <Pin className="h-3.5 w-3.5 mr-1" />
                        Pin
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!confirmPin}
        onOpenChange={(open) => {
          if (!open) setConfirmPin(null)
        }}
        title="Toggle Pin"
        description="Are you sure you want to toggle the pin status of this thread?"
        onConfirm={async () => {
          if (confirmPin) {
            await onPinToggle(confirmPin)
            setConfirmPin(null)
          }
        }}
      />
    </div>
  )
}
