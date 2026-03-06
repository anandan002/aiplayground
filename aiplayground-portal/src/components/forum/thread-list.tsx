"use client"

import { useState } from "react"
import { ThreadCard } from "./thread-card"
import { Button } from "@/components/ui/button"
import type { ThreadWithMeta } from "@/types"
import { EmptyState } from "@/components/common/empty-state"

interface ThreadListProps {
  threads: ThreadWithMeta[]
  modules: { id: string; title: string; slug: string }[]
}

export function ThreadList({ threads, modules }: ThreadListProps) {
  const [filter, setFilter] = useState<string>("all")

  const filteredThreads = threads.filter((t) => {
    if (filter === "all") return true
    if (filter === "general") return t.moduleId === null
    return t.moduleId === filter
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "general" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("general")}
        >
          General
        </Button>
        {modules.map((mod) => (
          <Button
            key={mod.id}
            variant={filter === mod.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(mod.id)}
          >
            {mod.title}
          </Button>
        ))}
      </div>

      {filteredThreads.length === 0 ? (
        <EmptyState
          icon="message"
          title="No threads found"
          description="Be the first to start a discussion!"
        />
      ) : (
        <div className="space-y-2">
          {filteredThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      )}
    </div>
  )
}
