import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ModuleGrid } from "@/components/modules/module-grid"
import { Progress } from "@/components/ui/progress"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { resources: true } },
      progress: {
        where: { userId: session.user.id },
        take: 1,
      },
    },
  })

  const modulesWithProgress = modules.map((mod) => ({
    ...mod,
    resourceCount: mod._count.resources,
    progress: mod.progress[0] ?? null,
    _count: undefined,
  }))

  const totalModules = modules.length
  const completedModules = modules.filter(
    (m) => m.progress[0]?.completed
  ).length
  const progressPercent =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {session.user.name}
        </h2>
        <p className="text-muted-foreground mt-1">
          Track your progress through the AI/ML learning modules.
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Overall Progress
          </h3>
          <span className="text-sm font-semibold text-indigo-600">
            {completedModules} / {totalModules} modules
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {progressPercent}% complete
        </p>
      </div>

      <ModuleGrid modules={modulesWithProgress} />
    </div>
  )
}
