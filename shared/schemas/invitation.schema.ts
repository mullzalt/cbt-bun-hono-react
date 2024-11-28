import { z } from "zod";

export const acceptInvitationSchema = z.object({
  email: z.string().email(),
});

export const invitationUrlQuerySchema = z.object({
  status: z.enum(["pending", "accepted", "expired"]).default("pending"),
  cursor: z.string().optional(),
  limit: z.coerce.number().gt(0).default(10),
});

export type InvitationUrlQuery = z.infer<typeof invitationUrlQuerySchema>;

export type InvitationStatus = z.infer<
  typeof invitationUrlQuerySchema.shape.status
>;
