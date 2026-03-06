import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, MessageSquare, Activity } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const [userCount, moduleCount, threadCount, postCount] = await Promise.all([
    prisma.user.count(),
    prisma.module.count(),
    prisma.forumThread.count(),
    prisma.forumPost.count(),
  ])

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const activeThisWeek = await prisma.user.count({
    where: {
      OR: [
        { forumPosts: { some: { createdAt: { gte: weekAgo } } } },
        { progress: { some: { completedAt: { gte: weekAgo } } } },
      ],
    },
  })

  const stats = [
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Modules",
      value: moduleCount,
      icon: BookOpen,
      href: "/admin/modules",
    },
    {
      title: "Forum Posts",
      value: postCount,
      icon: MessageSquare,
      href: "/admin/forum",
    },
    {
      title: "Active This Week",
      value: activeThisWeek,
      icon: Activity,
      href: "/admin/analytics",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Manage users, modules, and forum content.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/users"
              className="block text-sm text-indigo-600 hover:underline"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/modules"
              className="block text-sm text-indigo-600 hover:underline"
            >
              Manage Module Resources
            </Link>
            <Link
              href="/admin/forum"
              className="block text-sm text-indigo-600 hover:underline"
            >
              Moderate Forum
            </Link>
            <Link
              href="/admin/analytics"
              className="block text-sm text-indigo-600 hover:underline"
            >
              View Analytics
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Forum Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>{threadCount} threads total</p>
            <p>{postCount} posts total</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
