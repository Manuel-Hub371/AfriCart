import { z } from "zod";

export const RejectVendorSchema = z.object({
  reason: z.string().min(5, "Rejection reason must be at least 5 characters long"),
});

export const RequestVendorChangesSchema = z.object({
  reason: z.string().min(5, "Requested changes reason must be at least 5 characters long"),
});

export const SuspendVendorSchema = z.object({
  reason: z.string().min(5, "Suspension reason must be at least 5 characters long"),
});

export type RejectVendorInput = z.infer<typeof RejectVendorSchema>;
export type RequestVendorChangesInput = z.infer<typeof RequestVendorChangesSchema>;
export type SuspendVendorInput = z.infer<typeof SuspendVendorSchema>;

export type {
  AdminMetricsDTO,
  VendorApplicationItemDTO,
  VendorApplicationDetailDTO,
} from "@/shared/types/admin";
