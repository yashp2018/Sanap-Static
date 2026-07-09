import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  adminLoginByEmail: (email: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

interface RegisterData {
  name: string;
  phone: string;
  email?: string;
  password: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = "/api/auth";

async function apiFetch(path: string, body?: object, method?: string) {
  const res = await fetch(`${API}${path}`, {
    method: method ?? (body ? "POST" : "GET"),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  // 401 on /me is expected when not logged in — don't throw, just return null
  if (res.status === 401) return null;
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on app load
  useEffect(() => {
    apiFetch("/me")
      .then((d) => setUser(d?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (emailOrPhone: string, password: string) => {
    const data = await apiFetch("/login", { email: emailOrPhone, password });
    setUser(data.user);
  }, []);

  const adminLoginByEmail = useCallback(async (email: string) => {
    const data = await apiFetch("/admin-login", { email });
    if (!data?.user || data.user.role !== "admin") throw new Error("No admin account found for this email.");
    setUser(data.user);
  }, []);

  const register = useCallback(async (formData: RegisterData) => {
    const data = await apiFetch("/register", formData);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/logout", {}, "POST");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      adminLoginByEmail,
      register,
      logout,
      isAdmin: user?.role === "admin",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
