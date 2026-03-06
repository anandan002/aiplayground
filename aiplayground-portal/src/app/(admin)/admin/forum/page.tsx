"use client"

import { useState, useEffect, useCallback } from "react"
import { ModerationPanel } from "@/components/admin/moderation-panel"
import { LoadingSpinner } from "@/components/common/loading-spinner"
import { useToast } from "@/hooks/use-toast"

export default function AdminForumPage() {
  const [threads, setThreads] = useState<ThreadData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/forum/threads")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setThreads(data)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch forum data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handlePinToggle(threadId: string) {
    try {
      const res = await fetch(`/api/admin/forum/threads/${threadId}/pin`, {
        method: "PATCH",
      })
      if (!res.ok) throw new Error()
      toast({ title: "Thread pin toggled" })
      fetchData()
    } catch {
      toast({
        title: "Error",
        description: "Failed to toggle pin.",
        variant: "destructive",
      })
    }
  }

  async function handleDeletePost(postId: string) {
    try {
      const res = await fetch(`/api/admin/forum/posts/${postId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      toast({ title: "Post deleted" })
      fetchData()
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Forum Moderation
        </h2>
        <p className="text-muted-foreground mt-1">
          Pin threads and manage forum content.
        </p>
      </div>

      <ModerationPanel
        threads={threads}
        onPinToggle={handlePinToggle}
        onDeletePost={handleDeletePost}
      />
    </div>
  )
}

type ThreadData = {
  id: string
  title: string
  pinned: boolean
  createdAt: string
  user: { id: string; name: string }
  module: { title: string; slug: string } | null
  _count: { posts: number }
  posts: { createdAt: string }[]
}
