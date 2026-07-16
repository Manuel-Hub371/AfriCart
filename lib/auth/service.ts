// Authentication Service - API Integration Layer

import { 
  LoginCredentials, 
  RegisterCustomerData, 
  RegisterVendorData, 
  AuthResponse,
  User 
} from "./types";
import { storage } from "./storage";

// Mock API base URL - Replace with actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Mock delay for development
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Login user with email/phone and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    await mockDelay(1000);

    // Mock successful login
    if (credentials.email === "customer@test.com" && credentials.password === "Password123") {
      const response: AuthResponse = {
        user: {
          id: "1",
          email: "customer@test.com",
          firstName: "John",
          lastName: "Doe",
          phone: "+1234567890",
          role: "customer",
          emailVerified: true,
          createdAt: new Date().toISOString(),
        },
        accessToken: "mock_access_token_customer",
        refreshToken: "mock_refresh_token_customer",
      };
      return response;
    }

    if (credentials.email === "vendor@test.com" && credentials.password === "Password123") {
      const response: AuthResponse = {
        user: {
          id: "2",
          email: "vendor@test.com",
          firstName: "Jane",
          lastName: "Smith",
          phone: "+1234567891",
          role: "vendor",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          storeName: "Tech World",
          storeStatus: "approved",
        },
        accessToken: "mock_access_token_vendor",
        refreshToken: "mock_refresh_token_vendor",
      };
      return response;
    }

    // Mock failed login
    throw new Error("Invalid email or password");
  },

  /**
   * Register new customer
   */
  async registerCustomer(data: RegisterCustomerData): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    await mockDelay(1000);

    // Mock validation
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Mock successful registration
    const response: AuthResponse = {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: "customer",
        emailVerified: false,
        createdAt: new Date().toISOString(),
      },
      accessToken: "mock_access_token_new_customer",
      refreshToken: "mock_refresh_token_new_customer",
    };

    return response;
  },

  /**
   * Register new vendor
   */
  async registerVendor(data: RegisterVendorData): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    await mockDelay(1500);

    // Mock validation
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (!data.acceptTerms || !data.acceptVendorPolicy) {
      throw new Error("You must accept the terms and policies");
    }

    // Mock successful registration
    const response: AuthResponse = {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: "vendor",
        emailVerified: false,
        createdAt: new Date().toISOString(),
        storeName: data.storeName,
        storeStatus: "pending",
      },
      accessToken: "mock_access_token_new_vendor",
      refreshToken: "mock_refresh_token_new_vendor",
    };

    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    // TODO: Call backend to invalidate tokens
    await mockDelay(300);
    
    // Clear local storage
    storage.clearAll();
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    // TODO: Replace with actual API call
    const token = storage.getAccessToken();
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    await mockDelay(500);

    // Mock: Return stored user
    const storedUser = storage.getUser();
    if (storedUser) {
      return storedUser;
    }

    throw new Error("User not found");
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ accessToken: string }> {
    // TODO: Replace with actual API call
    const refreshToken = storage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    await mockDelay(500);

    // Mock: Return new access token
    return {
      accessToken: "mock_new_access_token_" + Date.now(),
    };
  },

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    // TODO: Replace with actual API call
    await mockDelay(1000);
    console.log("Email verified with token:", token);
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    // TODO: Replace with actual API call
    await mockDelay(1000);
    console.log("Password reset requested for:", email);
  },

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // TODO: Replace with actual API call
    await mockDelay(1000);
    console.log("Password reset with token:", token);
  },
};
