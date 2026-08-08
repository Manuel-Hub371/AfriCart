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

export interface AdminMetricsDTO {
  totalUsers: number;
  totalVendors: number;
  pendingApplications: number;
  approvedVendors: number;
  rejectedApplications: number;
  changesRequestedApplications: number;
  activeStores: number;
  suspendedStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface VendorApplicationItemDTO {
  id: string; // storeId
  vendorProfileId: string;
  userId: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string | null;
  businessName: string;
  businessType: string | null;
  businessCategory: string;
  categories: string[];
  storeName: string;
  storeSlug: string;
  country: string;
  region: string;
  city: string;
  status: string; // "PENDING_APPROVAL" | "ACTIVE" | "REJECTED" | "CHANGES_REQUESTED" | "SUSPENDED"
  submittedAt: string;
  updatedAt: string;
  hasIdDocument: boolean;
  hasBusinessCert: boolean;
}

export interface VendorApplicationDetailDTO {
  id: string; // storeId
  vendorProfileId: string;
  userId: string;
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  userStatus: string;
  
  // Business Info
  businessName: string;
  businessType: string | null;
  businessCategory: string;
  categories: { id: string; name: string; slug: string }[];
  businessAddress: string;
  city: string;
  region: string;
  country: string;
  
  // Verification & Tax
  registrationNumber: string | null;
  taxId: string | null;
  idDocumentUrl: string | null;
  businessCertificateUrl: string | null;
  rejectionReason: string | null;
  identityVerificationStatus: string;
  businessVerificationStatus: string;
  reviewedAt: string | null;
  reviewerName: string | null;
  
  // Store Info
  storeName: string;
  storeSlug: string;
  storeDescription: string | null;
  storeLogo: string | null;
  storeBanner: string | null;
  storeStatus: string;
  isPublic: boolean;
  
  // Payout Profile
  payoutMethod: string | null;
  payoutProvider: string | null;
  payoutAccountNumber: string | null;
  payoutAccountName: string | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
