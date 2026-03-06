import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, BookOpen } from "lucide-react"
import type { ModuleWithProgress } from "@/types"

interface ModuleCardProps {
  module: ModuleWithProgress
}

export function ModuleCard({ module }: ModuleCardProps) {
  const isCompleted = module.progress?.completed ?? false

  return (
    <Link href={`/modules/${module.slug}`}>
      <Card className="h-full transition-all hover:shadow-md hover:border-indigo-200 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className="text-xs font-mono">
              {String(module.order).padStart(2, "0")}
            </Badge>
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
          </div>
          <CardTitle className="text-lg mt-2 group-hover:text-indigo-700 transition-colors">
            {module.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {module.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>
              {module.resourceCount} resource{module.resourceCount !== 1 ? "s" : ""}
            </span>
            {isCompleted && (
              <Badge variant="secondary" className="ml-auto text-xs text-green-700 bg-green-50">
                Completed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
