import { ModuleCard } from "./module-card"
import type { ModuleWithProgress } from "@/types"

interface ModuleGridProps {
  modules: ModuleWithProgress[]
}

export function ModuleGrid({ modules }: ModuleGridProps) {
  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No modules available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  )
}
