"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from "lucide-react"
import { ResourceForm } from "./resource-form"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { ModuleResource } from "@prisma/client"

interface ResourceTableProps {
  moduleSlug: string
  resources: ModuleResource[]
}

export function ResourceTable({ moduleSlug, resources }: ResourceTableProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [editingResource, setEditingResource] = useState<ModuleResource | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  async function handleDelete() {
    if (!deletingId) return
    try {
      const res = await fetch(
        `/api/admin/modules/${moduleSlug}/resources/${deletingId}`,
        { method: "DELETE" }
      )
      if (!res.ok) throw new Error()
      toast({ title: "Resource deleted" })
      router.refresh()
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete resource.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-3">
      {resources.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.title}</TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {resource.url}
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={resource.type === "VIDEO" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {resource.type}
                  </Badge>
                </TableCell>
                <TableCell>{resource.order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingResource(resource)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setDeletingId(resource.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground py-3">
          No resources added yet.
        </p>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowCreate(true)}
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Resource
      </Button>

      <ResourceForm
        open={showCreate}
        onOpenChange={setShowCreate}
        moduleSlug={moduleSlug}
        onSuccess={() => {
          setShowCreate(false)
          router.refresh()
        }}
      />

      {editingResource && (
        <ResourceForm
          open={!!editingResource}
          onOpenChange={(open) => {
            if (!open) setEditingResource(null)
          }}
          moduleSlug={moduleSlug}
          resource={editingResource}
          onSuccess={() => {
            setEditingResource(null)
            router.refresh()
          }}
        />
      )}

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null)
        }}
        title="Delete Resource"
        description="Are you sure you want to delete this resource? This action cannot be undone."
        onConfirm={handleDelete}
        destructive
      />
    </div>
  )
}
