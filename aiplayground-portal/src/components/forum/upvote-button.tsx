"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface UpvoteButtonProps {
  postId: string
  initialCount: number
  initialUpvoted: boolean
}

export function UpvoteButton({
  postId,
  initialCount,
  initialUpvoted,
}: UpvoteButtonProps) {
  const [upvoted, setUpvoted] = useState(initialUpvoted)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)

  async function toggleUpvote() {
    // Optimistic update
    setUpvoted(!upvoted)
    setCount((c) => (upvoted ? c - 1 : c + 1))
    setIsLoading(true)

    try {
      const res = await fetch(`/api/forum/posts/${postId}/upvote`, {
        method: "POST",
      })

      if (!res.ok) {
        // Revert
        setUpvoted(upvoted)
        setCount(count)
      } else {
        const data = await res.json()
        setUpvoted(data.upvoted)
        setCount(data.count)
      }
    } catch {
      // Revert
      setUpvoted(upvoted)
      setCount(count)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "text-xs h-7 px-2 gap-1",
        upvoted
          ? "text-indigo-600 hover:text-indigo-700"
          : "text-muted-foreground"
      )}
      onClick={toggleUpvote}
      disabled={isLoading}
    >
      <ThumbsUp className={cn("h-3.5 w-3.5", upvoted && "fill-current")} />
      {count > 0 && <span>{count}</span>}
    </Button>
  )
}
