/**
 * QC-CMS EDMS - GAS API Client (Type-Safe)
 * Manages communication with Google Apps Script backend through the Next.js API proxy.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  [key: string]: unknown;
}

export class GasApiError extends Error {
  constructor(message: string, public action: string, public rawError?: unknown) {
    super(message);
    this.name = "GasApiError";
  }
}

/**
 * Retrieve current active session token from storage
 */
export function getStoredSessionToken(): string {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("qccms_session") ||
    localStorage.getItem("qc_session_token") ||
    sessionStorage.getItem("qccms_session") ||
    ""
  );
}

/**
 * Persist session token to storage
 */
export function setStoredSessionToken(token: string): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("qccms_session", token);
    localStorage.setItem("qc_session_token", token);
  } else {
    localStorage.removeItem("qccms_session");
    localStorage.removeItem("qc_session_token");
  }
}

/**
 * Generic type-safe call to Google Apps Script actions
 * @param action Backend function name defined in kode.gs ALLOWED list
 * @param args Arguments array passed to the GAS function
 */
export async function callGasApi<T = unknown>(action: string, args: unknown[] = []): Promise<ApiResponse<T>> {
  const sessionToken = getStoredSessionToken();

  const payload = {
    action,
    args,
    sessionToken,
    timestamp: Date.now(),
  };

  try {
    const res = await fetch("/api/gas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    const data: ApiResponse<T> = await res.json();
    return data;
  } catch (err) {
    const error = err as Error;
    console.error(`[GAS Client Error: ${action}]`, error);
    throw new GasApiError(error.message || "Gagal menghubungi server GAS", action, error);
  }
}
