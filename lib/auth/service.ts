// Authentication Service - API Integration Layer

import { 
  LoginCredentials, 
  RegisterCustomerData, 
  RegisterVendorData, 
  AuthResponse,
  User 
} from "./types";
import { storage } from "./storage";

export const authService = {
  /**
   * Login user with email/phone and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed. Please check your credentials.");
    }

    return {
      user: data.user,
      accessToken: "", // Session managed entirely in HttpOnly cookies
      refreshToken: ""
    };
  },

  /**
   * Register new customer
   */
  async registerCustomer(data: RegisterCustomerData): Promise<AuthResponse> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || "Registration failed.");
    }

    return {
      user: resData.user,
      accessToken: "",
      refreshToken: ""
    };
  },

  /**
   * Register new vendor
   */
  async registerVendor(data: RegisterVendorData): Promise<AuthResponse> {
    const response = await fetch("/api/auth/register-vendor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || "Vendor registration failed.");
    }

    return {
      user: resData.user,
      accessToken: "",
      refreshToken: ""
    };
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
    } finally {
      // Always clear local cache storage
      storage.clearAll();
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      cache: "no-store"
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Unauthorized session.");
    }

    return data.user;
  },

  /**
   * Refresh access token (Implicitly resolved via cookies and me endpoint)
   */
  async refreshToken(): Promise<{ accessToken: string }> {
    const user = await this.getCurrentUser();
    return { accessToken: "" };
  },

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    const response = await fetch(`/api/auth/verify-email?token=${token}`, {
      method: "POST"
    });
    if (!response.ok) {
      throw new Error("Email verification failed");
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      throw new Error("Password reset request failed");
    }
  },

  /**
   * Reset password
   */
  async resetPassword(token: string, password: string): Promise<void> {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    if (!response.ok) {
      throw new Error("Password reset failed");
    }
  },

  /**
   * Upgrade Customer to Vendor
   */
  async upgradeToVendor(data: any): Promise<User> {
    const response = await fetch("/api/auth/upgrade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || "Failed to upgrade account to vendor.");
    }

    return resData.user;
  }
};
