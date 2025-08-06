"use client";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TableConfigProvider } from "@/contexts/TableConfigContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isTestPage = pathname === "/test-componenti";
  const isTestPage2 = pathname === "/test-componenti-fase2";
  const isTestSistemaForm = pathname === "/test-sistema-form";
  const isTestHookForm = pathname === "/test-hook-form";
  return (
    <AuthProvider>
      <TableConfigProvider>
        {isLoginPage || isTestPage || isTestPage2 || isTestSistemaForm || isTestHookForm ? children : <ProtectedRoute>{children}</ProtectedRoute>}
      </TableConfigProvider>
    </AuthProvider>
  );
}
