"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  AuthState, 
  LoginCredentials, 
  RegisterCustomerData, 
  RegisterVendorData 
} from "./types";
import { authService } from "./service";
import { storage } from "./storage";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  registerCustomer: (data: RegisterCustomerData) => Promise<void>;
  registerVendor: (data: RegisterVendorData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    accessToken: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = storage.getAccessToken();
        const storedUser = storage.getUser();

        if (token && storedUser) {
          // Verify token is still valid
          const user = await authService.getCurrentUser();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            accessToken: token,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            accessToken: null,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        storage.clearAll();
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          accessToken: null,
        });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Store tokens
      storage.setAccessToken(response.accessToken);
      storage.setRefreshToken(response.refreshToken);
      storage.setUser(response.user);

      // Update state
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        accessToken: response.accessToken,
      });

      // Redirect based on role
      const redirectPath = getRedirectPath(response.user.role);
      router.push(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, [router]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      
      // Clear storage
      storage.clearAll();

      // Update state
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
      });

      // Redirect to home
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear state anyway
      storage.clearAll();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
      });
      router.push("/");
    }
  }, [router]);

  // Register customer
  const registerCustomer = useCallback(async (data: RegisterCustomerData) => {
    try {
      const response = await authService.registerCustomer(data);
      
      // Store tokens
      storage.setAccessToken(response.accessToken);
      storage.setRefreshToken(response.refreshToken);
      storage.setUser(response.user);

      // Update state
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        accessToken: response.accessToken,
      });

      // Redirect to welcome or dashboard
      router.push("/auth/welcome");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }, [router]);

  // Register vendor
  const registerVendor = useCallback(async (data: RegisterVendorData) => {
    try {
      const response = await authService.registerVendor(data);
      
      // Store tokens
      storage.setAccessToken(response.accessToken);
      storage.setRefreshToken(response.refreshToken);
      storage.setUser(response.user);

      // Update state
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        accessToken: response.accessToken,
      });

      // Redirect to pending approval page
      router.push("/auth/pending-approval");
    } catch (error) {
      console.error("Vendor registration error:", error);
      throw error;
    }
  }, [router]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    registerCustomer,
    registerVendor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Helper function to determine redirect path based on role
function getRedirectPath(role: string): string {
  switch (role) {
    case "customer":
      return "/"; // Or /customer/dashboard when implemented
    case "vendor":
      return "/vendor";
    case "admin":
      return "/admin"; // Or /admin/dashboard when implemented
    default:
      return "/";
  }
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
