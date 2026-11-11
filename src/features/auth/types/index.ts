export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "QAQC_ENGINEER" | "INSPECTOR" | "PROJECT_MANAGER" | "VIEWER" | string;
  department?: string;
  avatarUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  sessionToken?: string;
  user?: User;
}

