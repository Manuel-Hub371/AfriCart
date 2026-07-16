// Authentication Types

export type UserRole = "customer" | "vendor" | "admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  
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
  businessName: string;
  businessCategory: string;
  country: string;
  region: string;
  city: string;
  businessAddress: string;
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
