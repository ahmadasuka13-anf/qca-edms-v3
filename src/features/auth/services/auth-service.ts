import { callGasApi, setStoredSessionToken, getStoredSessionToken } from "@/lib/gas-client";
import { AuthResponse, LoginCredentials, User } from "../types";

export const authService = {
  /**
   * Authenticate user with Google Apps Script backend
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await callGasApi<AuthResponse>("login", [credentials.email, credentials.password]);
    const rawToken = res.token || res.sessionToken || (res.data && res.data.token) || (res.data && res.data.sessionToken) || "";
    const token = String(rawToken || "");

    if (res.success && token) {
      setStoredSessionToken(token);
    }
    return res as unknown as AuthResponse;
  },

  /**
   * Log out and clear session tokens
   */
  async logout(): Promise<void> {
    const token = getStoredSessionToken();
    try {
      if (token) {
        await callGasApi("logout", [token]);
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      setStoredSessionToken("");
    }
  },

  /**
   * Retrieve current session user data
   */
  async getCurrentUser(): Promise<User | null> {
    const token = getStoredSessionToken();
    if (!token) return null;

    try {
      const res = await callGasApi<User>("getSessionUser", [token]);
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },
};
