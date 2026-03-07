import { prisma } from "@/lib/prisma"
import { ModuleManagement } from "@/components/admin/module-management"

export default async function AdminModulesPage() {
  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: {
      resources: { orderBy: { order: "asc" } },
    },
  })

  return <ModuleManagement modules={modules} />
}
