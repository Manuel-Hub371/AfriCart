// Session storage utility (token local storage disabled for HttpOnly cookie safety)

const USER_KEY = "afriCart_user";

export const storage = {
  // Access Token (Deprecated - Cookies are used instead)
  getAccessToken: (): string | null => {
    return null;
  },

  setAccessToken: (token: string): void => {
    // No-op for cookie security
  },

  removeAccessToken: (): void => {
    // No-op
  },

  // Refresh Token (Deprecated - Cookies are used instead)
  getRefreshToken: (): string | null => {
    return null;
  },

  setRefreshToken: (token: string): void => {
    // No-op for cookie security
  },

  removeRefreshToken: (): void => {
    // No-op
  },

  // User Data (Cached locally for immediate page rendering before API checks load)
  getUser: (): any | null => {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  setUser: (user: any): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_KEY);
  },

  // Clear all auth cache
  clearAll: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_KEY);
  },
};
