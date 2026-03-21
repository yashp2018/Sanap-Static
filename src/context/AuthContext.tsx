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

async function apiFetch(path: string, body?: object) {
  const res = await fetch(`${API}${path}`, {
    method: body ? "POST" : "GET",
    credentials: "include",                          // send session cookie
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);   // true until session check done

  // Check existing session on app load
  useEffect(() => {
    apiFetch("/me.php")
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))          // silently treat 401/network error as logged-out
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (emailOrPhone: string, password: string) => {
    const data = await apiFetch("/login.php", { email: emailOrPhone, password });
    setUser(data.user);
  }, []);

  const register = useCallback(async (formData: RegisterData) => {
    const data = await apiFetch("/register.php", formData);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/logout.php", {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
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
