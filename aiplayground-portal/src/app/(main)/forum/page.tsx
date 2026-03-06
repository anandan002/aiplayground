import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ThreadList } from "@/components/forum/thread-list"
import { CreateThreadDialog } from "@/components/forum/create-thread-dialog"

export default async function ForumPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const threads = await prisma.forumThread.findMany({
    include: {
      user: { select: { id: true, name: true } },
      module: { select: { title: true, slug: true } },
      _count: { select: { posts: true } },
      posts: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  })

  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    select: { id: true, title: true, slug: true },
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Forum</h2>
          <p className="text-muted-foreground mt-1">
            Discuss modules, ask questions, and share knowledge.
          </p>
        </div>
        <CreateThreadDialog modules={modules} />
      </div>

      <ThreadList threads={threads} modules={modules} />
    </div>
  )
}
