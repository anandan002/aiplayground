import { BookOpen, MessageSquare, FileText, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"

type IconType = "book" | "message" | "file" | "inbox"

interface EmptyStateProps {
  icon?: IconType
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

const iconMap = {
  book: BookOpen,
  message: MessageSquare,
  file: FileText,
  inbox: Inbox,
}

export function EmptyState({ icon = "inbox", title, description, action }: EmptyStateProps) {
  const Icon = iconMap[icon]

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="outline" size="sm" className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  )
}
