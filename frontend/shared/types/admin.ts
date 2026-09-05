// Shared Admin DTO types.
//
// Imported by both the backend (modules/*) and the frontend pages (app/admin/*).
// Keeping these pure-type definitions out of the backend modules lets the frontend
// import them without coupling to backend business logic / zod.

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
