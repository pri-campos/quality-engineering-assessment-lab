import { z } from "zod";

export const createParticipantSchema = z.object({
  name: z.string().min(3),
  email: z.string().email()
});
