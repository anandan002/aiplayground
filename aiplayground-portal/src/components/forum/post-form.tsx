"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, Send } from "lucide-react"

interface PostFormProps {
  threadId: string
  parentId?: string
  onSuccess?: () => void
  compact?: boolean
}

export function PostForm({ threadId, parentId, onSuccess, compact }: PostFormProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/forum/threads/${threadId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), parentId }),
      })

      if (!res.ok) {
        throw new Error("Failed to create post")
      }

      setContent("")
      toast({ title: "Reply posted" })
      router.refresh()
      onSuccess?.()
    } catch {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Textarea
        placeholder={compact ? "Write a reply..." : "Share your thoughts..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={compact ? 2 : 3}
        disabled={isLoading}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button type="submit" size={compact ? "sm" : "default"} disabled={isLoading || !content.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4 mr-1.5" />
              {compact ? "Reply" : "Post Reply"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
