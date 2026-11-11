"use client";

import { useState, useEffect, useCallback } from "react";
import { User, LoginCredentials } from "../types";
import { authService } from "../services/auth-service";
import { getStoredSessionToken, setStoredSessionToken } from "@/lib/gas-client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    const token = getStoredSessionToken();
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        // Fallback session if token exists
        setUser({
          id: "USR-001",
          name: "QA/QC Engineer",
          email: "qaqc@asuka.id",
          role: "QAQC_ENGINEER",
          department: "Quality Assurance",
        });
        setIsAuthenticated(true);
      }
    } catch (err) {
      setError((err as Error).message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const token = getStoredSessionToken();
      if (!token) {
        if (isMounted) {
          setIsLoading(false);
          setIsAuthenticated(false);
        }
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            setUser({
              id: "USR-001",
              name: "QA/QC Engineer",
              email: "qaqc@asuka.id",
              role: "QAQC_ENGINEER",
              department: "Quality Assurance",
            });
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(credentials);
      if (res.success) {
        await checkAuth();
        return true;
      } else {
        setError(res.message || "Email atau password tidak sesuai.");
        return false;
      }
    } catch (err) {
      setError((err as Error).message || "Gagal menghubungkan ke server.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = () => {
    const demoUser: User = {
      id: "USR-001",
      name: "Ahmad Nur Fatony",
      email: "ahmad.fatony@asuka.id",
      role: "QAQC_ENGINEER",
      department: "Quality Assurance",
    };
    setUser(demoUser);
    setIsAuthenticated(true);
    setStoredSessionToken("demo-session-token");
  };

  const logout = async () => {
    setIsLoading(true);
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginDemo,
    logout,
    refreshUser: checkAuth,
  };
}
