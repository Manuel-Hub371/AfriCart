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
  upgradeToVendor: (data: any) => Promise<void>;
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
        // Fetch current user from /api/auth/me (handles cookies & session rotation)
        const user = await authService.getCurrentUser();
        storage.setUser(user);
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          accessToken: null, // Token hidden inside HttpOnly cookie
        });
      } catch (error) {
        // If not authenticated, check if cached user exists for immediate layout rendering
        const cachedUser = storage.getUser();
        
        if (cachedUser) {
          // If we had cache, we might still be loading or unauthorized. Set loading false
          storage.clearAll();
        }
        
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
      
      // Cache user object for UI speed
      storage.setUser(response.user);

      // Update state
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        accessToken: null,
      });

      // Redirect based on role / query params
      const storedRedirect = sessionStorage.getItem("redirectAfterLogin");
      if (storedRedirect) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(storedRedirect);
      } else {
        const redirectPath = getRedirectPath(response.user.roles);
        router.push(redirectPath);
      }
    } catch (error) {
      console.error("Login error in context:", error);
      throw error;
    }
  }, [router]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error in context:", error);
    } finally {
      // Always reset state on logout
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
      storage.setUser(response.user);

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        accessToken: null,
      });

      // Redirect to welcome
      router.push("/auth/welcome");
    } catch (error) {
      console.error("Registration error in context:", error);
      throw error;
    }
  }, [router]);

  // Register vendor
  const registerVendor = useCallback(async (data: RegisterVendorData) => {
    try {
      const response = await authService.registerVendor(data);
      storage.setUser(response.user);

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        accessToken: null,
      });

      // Redirect to pending approval page
      router.push("/auth/pending-approval");
    } catch (error) {
      console.error("Vendor registration error in context:", error);
      throw error;
    }
  }, [router]);

  // Upgrade customer to vendor
  const upgradeToVendor = useCallback(async (data: any) => {
    try {
      const updatedUser = await authService.upgradeToVendor(data);
      storage.setUser(updatedUser);

      setState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
        accessToken: null,
      });

      // Redirect directly to vendor dashboard on success
      router.push("/vendor");
    } catch (error) {
      console.error("Upgrade error in context:", error);
      throw error;
    }
  }, [router]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    registerCustomer,
    registerVendor,
    upgradeToVendor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Helper function to determine redirect path based on roles
function getRedirectPath(roles: string[]): string {
  if (roles.includes("ADMIN")) {
    return "/admin";
  }
  if (roles.includes("VENDOR")) {
    return "/vendor";
  }
  return "/profile";
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
