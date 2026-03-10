import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { getModuleContent, extractExercise } from "@/lib/markdown"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModuleContent } from "@/components/modules/module-content"
import { ResourceList } from "@/components/modules/resource-list"
import { ExerciseBlock } from "@/components/modules/exercise-block"
import { ProgressButton } from "@/components/modules/progress-button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ModuleDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const moduleData = await prisma.module.findUnique({
    where: { slug: params.slug },
    include: {
      resources: { orderBy: { order: "asc" } },
      progress: {
        where: { userId: session.user.id },
        take: 1,
      },
    },
  })

  if (!moduleData) notFound()

  const rawContent = getModuleContent(moduleData.contentFilePath)
  const { content, exercise } = extractExercise(rawContent)
  const progress = moduleData.progress[0] ?? null
  const isCompleted = progress?.completed ?? false

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Badge variant="outline" className="font-mono text-xs">
          Module {String(moduleData.order).padStart(2, "0")}
        </Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {moduleData.title}
        </h1>
        <p className="text-muted-foreground mt-2">{moduleData.description}</p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="resources">
            Resources ({moduleData.resources.length})
          </TabsTrigger>
          {exercise && <TabsTrigger value="exercise">Exercise</TabsTrigger>}
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <div className="bg-white rounded-lg border p-6 md:p-8">
            <ModuleContent content={content} />
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <ResourceList resources={moduleData.resources} />
        </TabsContent>

        {exercise && (
          <TabsContent value="exercise" className="mt-6">
            <ExerciseBlock exercise={exercise} />
          </TabsContent>
        )}
      </Tabs>

      <div className="pt-4 pb-6">
        <ProgressButton
          slug={moduleData.slug}
          initialCompleted={isCompleted}
        />
      </div>
    </div>
  )
}
