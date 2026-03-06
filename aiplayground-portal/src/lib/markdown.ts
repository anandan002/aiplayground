import fs from "fs"
import path from "path"

export function getModuleContent(filePath: string): string {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    return fs.readFileSync(fullPath, "utf-8")
  } catch {
    return "# Content Coming Soon\n\nThis module's content is being prepared."
  }
}

export function extractExercise(markdown: string): {
  content: string
  exercise: string
} {
  const exerciseMatch = markdown.split(/^## Exercise/m)
  if (exerciseMatch.length > 1) {
    return {
      content: exerciseMatch[0].trim(),
      exercise: exerciseMatch[1].trim(),
    }
  }
  return { content: markdown, exercise: "" }
}
