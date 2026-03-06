import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle2, MessageSquare, Activity } from "lucide-react"
import type { AnalyticsData } from "@/types"

interface StatsCardsProps {
  data: AnalyticsData
}

export function StatsCards({ data }: StatsCardsProps) {
  const totalUsers = data.userProgress.length
  const totalCompletions = data.userProgress.reduce(
    (sum, u) => sum + u.completedModules,
    0
  )

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
    },
    {
      title: "Modules Completed",
      value: totalCompletions,
      icon: CheckCircle2,
    },
    {
      title: "Forum Posts",
      value: data.forumActivity.totalPosts,
      icon: MessageSquare,
    },
    {
      title: "Posts This Week",
      value: data.forumActivity.postsThisWeek,
      icon: Activity,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
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
      ))}
    </div>
  )
}
