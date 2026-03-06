import { z } from "zod"

export const createResourceSchema = z.object({
  type: z.enum(["VIDEO", "LINK"]),
  title: z.string().min(1),
  url: z.string().url(),
  order: z.number().int().min(0),
})

export const updateResourceSchema = z.object({
  type: z.enum(["VIDEO", "LINK"]).optional(),
  title: z.string().min(1).optional(),
  url: z.string().url().optional(),
  order: z.number().int().min(0).optional(),
})
