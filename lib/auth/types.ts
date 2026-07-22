// Authentication Types

export type UserRole = "customer" | "vendor" | "admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: string[]; // Scalable multi-role system
  role: UserRole; // Backward-compatibility fallback
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  permissions?: string[]; // Dynamic permissions list
  
  // Vendor-specific
  storeName?: string;
  storeStatus?: "pending" | "approved" | "rejected";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterVendorData extends RegisterCustomerData {
  storeName: string;
  storeDescription: string;
  storeCategory: string;
  businessType: string;
  businessName: string;
  registrationNumber?: string;
  taxId?: string;
  businessEmail: string;
  businessPhone: string;
  country: string;
  region: string;
  city: string;
  streetAddress: string;
  postalCode?: string;
  payoutMethod: string;
  acceptTerms: boolean;
  acceptVendorPolicy: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}
