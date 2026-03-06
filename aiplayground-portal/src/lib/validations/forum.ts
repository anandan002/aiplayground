import { z } from "zod"

export const createThreadSchema = z.object({
  title: z.string().min(1).max(200),
  moduleId: z.string().nullable(),
  content: z.string().min(1),
})

export const createPostSchema = z.object({
  content: z.string().min(1),
  parentId: z.string().optional(),
})
