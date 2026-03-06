"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UpvoteButton } from "./upvote-button"
import { PostForm } from "./post-form"
import { MessageSquare } from "lucide-react"
import type { PostWithReplies } from "@/types"

interface PostCardProps {
  post: PostWithReplies
  threadId: string
  currentUserId: string
  depth: number
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function PostCard({ post, threadId, currentUserId, depth }: PostCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const isUpvoted = post.upvotes.some((u) => u.userId === currentUserId)
  const maxDepth = 3

  return (
    <div className={depth > 0 ? "ml-6 border-l-2 border-gray-100 pl-4" : ""}>
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs bg-gray-100">
              {getInitials(post.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{post.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {timeAgo(post.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {post.content}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <UpvoteButton
                postId={post.id}
                initialCount={post._count.upvotes}
                initialUpvoted={isUpvoted}
              />
              {depth < maxDepth && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2 text-muted-foreground"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  Reply
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="mt-2 ml-11">
          <PostForm
            threadId={threadId}
            parentId={post.id}
            onSuccess={() => setShowReplyForm(false)}
            compact
          />
        </div>
      )}

      {post.replies && post.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {post.replies.map((reply) => (
            <PostCard
              key={reply.id}
              post={reply}
              threadId={threadId}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
