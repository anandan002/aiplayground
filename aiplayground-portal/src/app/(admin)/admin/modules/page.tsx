import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResourceTable } from "@/components/admin/resource-table"
import { Badge } from "@/components/ui/badge"

export default async function AdminModulesPage() {
  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: {
      resources: { orderBy: { order: "asc" } },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Module Resources
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage resources for each module.
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((mod) => (
          <Card key={mod.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono text-xs">
                    {String(mod.order).padStart(2, "0")}
                  </Badge>
                  <CardTitle className="text-base">{mod.title}</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {mod.resources.length} resource
                  {mod.resources.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResourceTable
                moduleSlug={mod.slug}
                resources={mod.resources}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
