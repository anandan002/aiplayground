"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ProgressButtonProps {
  slug: string
  initialCompleted: boolean
}

export function ProgressButton({ slug, initialCompleted }: ProgressButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function toggleProgress() {
    const newValue = !completed
    setCompleted(newValue) // optimistic update
    setIsLoading(true)

    try {
      const res = await fetch(`/api/modules/${slug}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newValue }),
      })

      if (!res.ok) {
        setCompleted(!newValue) // revert
        toast({
          title: "Error",
          description: "Failed to update progress. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: newValue ? "Module completed!" : "Progress updated",
          description: newValue
            ? "Great job! Keep up the momentum."
            : "Module marked as incomplete.",
        })
        router.refresh()
      }
    } catch {
      setCompleted(!newValue) // revert
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={toggleProgress}
        disabled={isLoading}
        size="lg"
        variant={completed ? "outline" : "default"}
        className={
          completed
            ? "border-green-300 text-green-700 hover:bg-green-50"
            : "bg-indigo-600 hover:bg-indigo-700"
        }
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : completed ? (
          <CheckCircle2 className="mr-2 h-4 w-4" />
        ) : (
          <Circle className="mr-2 h-4 w-4" />
        )}
        {completed ? "Completed" : "Mark Complete"}
      </Button>
    </div>
  )
}
