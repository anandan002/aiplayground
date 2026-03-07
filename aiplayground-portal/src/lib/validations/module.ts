import { z } from "zod"

export const createModuleSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.number().int().min(1, "Order must be at least 1"),
  contentFilePath: z.string().min(1, "Content file path is required"),
})

export const updateModuleSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  order: z.number().int().min(1).optional(),
  contentFilePath: z.string().min(1).optional(),
})

export const reorderModulesSchema = z.object({
  modules: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(1),
    })
  ),
})
