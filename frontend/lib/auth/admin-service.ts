// Dedicated administrator authentication service.
//
// Talks ONLY to the admin-scoped API surface (/api/admin/auth/*). This is
// intentionally separate from the customer authService (/api/auth/*): admin
// login requires the ADMIN role server-side and admin registration produces a
// request that must be approved by an existing administrator.

import { apiFetch, parseApiResponse, ApiError, describeBadApiResponse } from "@/lib/api/client";

export interface AdminSessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  role?: string;
}

interface DataResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

async function request<T = unknown>(path: string, body?: unknown): Promise<DataResponse<T>> {
  const res = await apiFetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body,
  });

  const data = await parseApiResponse<any>(res);

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }
  if (data === null) {
    throw new ApiError(describeBadApiResponse(path, res), res.status, null);
  }
  return data as DataResponse<T>;
}

export const adminAuthService = {
  /**
   * Administrator login (server-side ADMIN role verification).
   * Returns the authenticated admin user after the HttpOnly session is set.
   */
  async login(credentials: { email: string; password: string }): Promise<AdminSessionUser> {
    const data = await request<{ user: AdminSessionUser }>("/api/admin/auth/login", credentials);
    if (!data.data?.user) {
      throw new ApiError("Administrator sign-in returned no session", 400, data);
    }
    return data.data.user;
  },

  /**
   * Submit an administrator access request (pending approval, no role granted).
   */
  async register(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ message: string }> {
    const data = await request<undefined>("/api/admin/auth/register", input);
    return { message: data.message || "Request submitted." };
  },

  /**
   * Resolve the current administrator session (role re-verified server-side).
   */
  async me(): Promise<AdminSessionUser> {
    const data = await request<{ user: AdminSessionUser }>("/api/admin/auth/me");
    if (!data.data?.user) {
      throw new ApiError("No active administrator session", 401, data);
    }
    return data.data.user;
  },

  /**
   * Administrator logout (revokes the server session and clears cookies).
   */
  async logout(): Promise<void> {
    await request("/api/admin/auth/logout");
  },

  /**
   * Request an admin password reset email (only issued to ADMIN accounts).
   */
  async requestPasswordReset(email: string): Promise<void> {
    await request("/api/admin/auth/forgot-password", { email });
  },

  /**
   * Complete an admin password reset.
   */
  async resetPassword(token: string, password: string, confirmPassword?: string): Promise<void> {
    await request("/api/admin/auth/reset-password", {
      token,
      password,
      confirmPassword: confirmPassword || password,
    });
  },
};