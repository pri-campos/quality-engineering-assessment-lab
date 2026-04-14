import { z } from "zod";

export const createWorkshopSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  capacity: z.number().int().positive(),
  scheduledAt: z.string().datetime()
});
