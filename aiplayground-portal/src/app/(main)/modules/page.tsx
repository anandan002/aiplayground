import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ModuleGrid } from "@/components/modules/module-grid"

export default async function ModulesPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Modules</h2>
        <p className="text-muted-foreground mt-1">
          Browse all available learning modules.
        </p>
      </div>
      <ModuleGrid modules={modulesWithProgress} />
    </div>
  )
}
