"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";

export default function Login() {
  const {
    login,
    user,
    isAuthenticated,
    loading,
    mfaRequired,
    verifyMfa,
    logout,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Redirect automatico alla home se autenticato
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    }
  }

  async function handleVerifyMfa(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await verifyMfa(user?.id || "", mfaCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    }
  }

  return (
    <AppLayout
      pageTitle="Login"
      pageDescription="Accedi al gestionale aziendale."
    >
      <div className="max-w-md mx-auto bg-neutral-800 border border-neutral-700 rounded-lg p-8 mt-8 shadow-lg">
        {loading && <div className="mb-4 text-info">Caricamento...</div>}
        {!isAuthenticated && !mfaRequired && (
          <form onSubmit={handleLogin} className="space-y-6 mb-4">
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Inserisci la tua email"
              type="email"
              autoComplete="username"
              required
            />
            <Input
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Login
            </Button>
          </form>
        )}
        {mfaRequired && (
          <form onSubmit={handleVerifyMfa} className="space-y-6 mb-4">
            <Input
              label="Codice MFA"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder="Inserisci il codice MFA"
              autoComplete="one-time-code"
              required
            />
            <Button type="submit" variant="success" className="w-full">
              Verifica MFA
            </Button>
          </form>
        )}
        {isAuthenticated && (
          <div className="mb-4 p-4 bg-neutral-700 border border-green-600 rounded-lg">
            <div className="mb-2 font-semibold text-green-400">
              Benvenuto, {user?.nome} {user?.cognome}
            </div>
            <div className="text-sm text-neutral-200">Email: {user?.email}</div>
            <div className="text-sm text-neutral-200">
              Ruoli: {user?.roles?.join(", ")}
            </div>
            <div className="text-sm text-neutral-200">
              MFA: {user?.mfaEnabled ? "Attivo" : "Non attivo"}
            </div>
            <Button onClick={logout} variant="danger" className="mt-4 w-full">
              Logout
            </Button>
          </div>
        )}
        {error && <div className="text-error font-semibold mt-2">{error}</div>}
      </div>
    </AppLayout>
  );
}
