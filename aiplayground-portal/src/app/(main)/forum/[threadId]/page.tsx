import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { PostCard } from "@/components/forum/post-card"
import { PostForm } from "@/components/forum/post-form"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pin } from "lucide-react"
import Link from "next/link"

export default async function ThreadDetailPage({
  params,
}: {
  params: { threadId: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const thread = await prisma.forumThread.findUnique({
    where: { id: params.threadId },
    include: {
      user: { select: { id: true, name: true } },
      module: { select: { title: true, slug: true } },
      posts: {
        where: { parentId: null },
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true } },
          _count: { select: { upvotes: true } },
          upvotes: {
            where: { userId: session.user.id },
            select: { userId: true },
          },
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              user: { select: { id: true, name: true } },
              _count: { select: { upvotes: true } },
              upvotes: {
                where: { userId: session.user.id },
                select: { userId: true },
              },
              replies: {
                orderBy: { createdAt: "asc" },
                include: {
                  user: { select: { id: true, name: true } },
                  _count: { select: { upvotes: true } },
                  upvotes: {
                    where: { userId: session.user.id },
                    select: { userId: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!thread) notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/forum"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Forum
      </Link>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {thread.pinned && (
            <Pin className="h-4 w-4 text-amber-500" />
          )}
          <h1 className="text-2xl font-bold tracking-tight">
            {thread.title}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>by {thread.user.name}</span>
          <span>&middot;</span>
          {thread.module ? (
            <Badge variant="secondary" className="text-xs">
              {thread.module.title}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              General
            </Badge>
          )}
          <span>&middot;</span>
          <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {thread.posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            threadId={thread.id}
            currentUserId={session.user.id}
            depth={0}
          />
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-medium mb-3">Reply to this thread</h3>
        <PostForm threadId={thread.id} />
      </div>
    </div>
  )
}
