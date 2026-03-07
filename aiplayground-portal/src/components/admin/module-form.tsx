"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ModuleData {
  id: string
  slug: string
  title: string
  description: string
  order: number
  contentFilePath: string
}

interface ModuleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  module?: ModuleData | null
  nextOrder: number
  onSuccess: () => void
}

export function ModuleForm({
  open,
  onOpenChange,
  module: editModule,
  nextOrder,
  onSuccess,
}: ModuleFormProps) {
  const isEditing = !!editModule
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [order, setOrder] = useState("")
  const [contentFilePath, setContentFilePath] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      if (editModule) {
        setTitle(editModule.title)
        setSlug(editModule.slug)
        setDescription(editModule.description)
        setOrder(String(editModule.order))
        setContentFilePath(editModule.contentFilePath)
        setSlugTouched(true)
      } else {
        setTitle("")
        setSlug("")
        setDescription("")
        setOrder(String(nextOrder))
        setContentFilePath("content/modules/")
        setSlugTouched(false)
      }
    }
  }, [open, editModule, nextOrder])

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEditing && !slugTouched) {
      setSlug(generateSlug(value))
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !description.trim() || !contentFilePath.trim()) return

    setIsLoading(true)
    try {
      if (isEditing) {
        const res = await fetch(`/api/admin/modules/${editModule!.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            order: parseInt(order, 10) || 1,
            contentFilePath: contentFilePath.trim(),
          }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Request failed")
        }
      } else {
        const res = await fetch("/api/admin/modules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: slug.trim(),
            title: title.trim(),
            description: description.trim(),
            order: parseInt(order, 10) || nextOrder,
            contentFilePath: contentFilePath.trim(),
          }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Request failed")
        }
      }

      toast({ title: isEditing ? "Module updated" : "Module created" })
      onSuccess()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Module" : "Add Module"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update module details."
              : "Create a new training module. Add an MD file at the content file path."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mod-title">Title</Label>
            <Input
              id="mod-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. AI-Assisted Dev Foundations"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mod-slug">Slug</Label>
            <Input
              id="mod-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
              placeholder="e.g. ai-assisted-dev-foundations"
              required
              disabled={isLoading || isEditing}
              pattern="^[a-z0-9-]+$"
              title="Lowercase letters, numbers, and hyphens only"
            />
            {isEditing && (
              <p className="text-xs text-muted-foreground">Slug cannot be changed after creation.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mod-desc">Description</Label>
            <Textarea
              id="mod-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the module"
              required
              disabled={isLoading}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mod-order">Order</Label>
              <Input
                id="mod-order"
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mod-path">Content File Path</Label>
              <Input
                id="mod-path"
                value={contentFilePath}
                onChange={(e) => setContentFilePath(e.target.value)}
                placeholder="content/modules/11-my-module.md"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update"
              ) : (
                "Create Module"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
