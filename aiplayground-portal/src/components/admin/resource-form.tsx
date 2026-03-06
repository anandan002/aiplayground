"use client"

import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { ModuleResource } from "@prisma/client"

interface ResourceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  moduleSlug: string
  resource?: ModuleResource | null
  onSuccess: () => void
}

export function ResourceForm({
  open,
  onOpenChange,
  moduleSlug,
  resource,
  onSuccess,
}: ResourceFormProps) {
  const isEditing = !!resource
  const [title, setTitle] = useState(resource?.title ?? "")
  const [url, setUrl] = useState(resource?.url ?? "")
  const [type, setType] = useState(resource?.type ?? "LINK")
  const [order, setOrder] = useState(String(resource?.order ?? 0))
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    setIsLoading(true)
    try {
      const apiUrl = isEditing
        ? `/api/admin/modules/${moduleSlug}/resources/${resource!.id}`
        : `/api/admin/modules/${moduleSlug}/resources`

      const res = await fetch(apiUrl, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          url: url.trim(),
          type,
          order: parseInt(order, 10) || 0,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Request failed")
      }

      toast({ title: isEditing ? "Resource updated" : "Resource created" })
      resetForm()
      onSuccess()
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setTitle("")
    setUrl("")
    setType("LINK")
    setOrder("0")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm()
        onOpenChange(v)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Resource" : "Add Resource"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update resource details."
              : "Add a new resource to this module."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="res-title">Title</Label>
            <Input
              id="res-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-url">URL</Label>
            <Input
              id="res-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LINK">Link</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-order">Order</Label>
            <Input
              id="res-order"
              type="number"
              min="0"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              disabled={isLoading}
            />
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
                "Add Resource"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
