"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/types/auth";

// Base URL delle API, configurabile tramite .env (es: http://localhost:4000 o http://10.10.10.15:3001/api)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Helper per comporre correttamente gli endpoint
function buildApiUrl(path: string) {
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  mfaRequired: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<void>;
  verifyMfa: (userId: string, mfaCode: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider");
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  // Carica token da sessionStorage (solo in client)
  useEffect(() => {
    const at =
      typeof window !== "undefined"
        ? sessionStorage.getItem("accessToken")
        : null;
    const rt =
      typeof window !== "undefined"
        ? sessionStorage.getItem("refreshToken")
        : null;
    if (at && rt) {
      setAccessToken(at);
      setRefreshToken(rt);
    }
    setLoading(false);
  }, []);

  // Salva token in sessionStorage
  useEffect(() => {
    if (accessToken) sessionStorage.setItem("accessToken", accessToken);
    else sessionStorage.removeItem("accessToken");
    if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
    else sessionStorage.removeItem("refreshToken");
  }, [accessToken, refreshToken]);

  // Recupera dati utente se accessToken presente
  useEffect(() => {
    if (accessToken) {
      fetchUser();
    } else {
      setUser(null);
    }
    // eslint-disable-next-line
  }, [accessToken]);

  // Funzione di login
  async function login(email: string, password: string, mfaCode?: string) {
    setLoading(true);
    setMfaRequired(false);
    setPendingUserId(null);
    try {
      const res = await fetch(buildApiUrl("auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mfaCode }),
      });
      const data = await res.json();
      if (data.mfaRequired && data.userId) {
        setMfaRequired(true);
        setPendingUserId(data.userId);
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
      } else if (data.accessToken && data.refreshToken && data.user) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
        setMfaRequired(false);
        setPendingUserId(null);
        // Logging azione
        await logAction("login", "Login riuscito");
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error("Errore sconosciuto durante il login");
      }
    } finally {
      setLoading(false);
    }
  }

  // Funzione verifica MFA
  async function verifyMfa(userId: string, mfaCode: string) {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("auth/mfa/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, mfaCode }),
      });
      const data = await res.json();
      if (data.success && data.accessToken && data.refreshToken) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setMfaRequired(false);
        setPendingUserId(null);
        await fetchUser();
        await logAction("mfa", "MFA verificato");
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Funzione logout
  async function logout() {
    setLoading(true);
    try {
      if (refreshToken) {
        await fetch(buildApiUrl("auth/logout"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setMfaRequired(false);
      setPendingUserId(null);
      await logAction("logout", "Logout utente");
    } finally {
      setLoading(false);
    }
  }

  // Funzione per recuperare dati utente
  async function fetchUser() {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("auth/userinfo"), {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (res.status === 401) {
        // Token scaduto o non valido, pulisce la sessione
        console.log("DEBUG - Token scaduto, pulizia sessione");
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        return;
      }
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.warn("DEBUG - Errore recupero utente:", error);
      setUser(null);
      // Non pulire i token per altri errori (es. rete)
    } finally {
      setLoading(false);
    }
  }

  // Funzione per logging azioni
  async function logAction(action: string, details?: string) {
    try {
      await fetch(buildApiUrl("auth/log"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || pendingUserId,
          action,
          ip: undefined, // opzionale: può essere gestito dal backend
          timestamp: new Date().toISOString(),
          details,
        }),
      });
    } catch {
      // Ignora errori di logging
    }
  }

  // Funzione per refresh automatico del token (da implementare in futuro)
  // ...

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user && !!accessToken,
        loading,
        mfaRequired,
        login,
        verifyMfa,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
