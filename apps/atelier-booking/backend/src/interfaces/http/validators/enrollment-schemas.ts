import { z } from "zod";

export const createEnrollmentSchema = z.object({
  participantId: z.string().min(1),
  workshopId: z.string().min(1)
});

export const idParamSchema = z.object({
  id: z.string().min(1)
});
