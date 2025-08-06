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
  return (
    <AuthProvider>
      <TableConfigProvider>
        {isLoginPage || isTestPage || isTestPage2 ? children : <ProtectedRoute>{children}</ProtectedRoute>}
      </TableConfigProvider>
    </AuthProvider>
  );
}
