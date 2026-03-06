import { ModuleContent } from "./module-content"
import { Lightbulb } from "lucide-react"

interface ExerciseBlockProps {
  exercise: string
}

export function ExerciseBlock({ exercise }: ExerciseBlockProps) {
  return (
    <div className="bg-indigo-50/50 border border-indigo-200 rounded-lg p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Lightbulb className="h-5 w-5 text-indigo-600" />
        </div>
        <h2 className="text-lg font-semibold text-indigo-900">
          Hands-on Exercise
        </h2>
      </div>
      <div className="bg-white/70 rounded-lg p-6">
        <ModuleContent content={exercise} />
      </div>
    </div>
  )
}
