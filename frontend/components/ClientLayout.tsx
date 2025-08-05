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
  return (
    <AuthProvider>
      <TableConfigProvider>
        {isLoginPage ? children : <ProtectedRoute>{children}</ProtectedRoute>}
      </TableConfigProvider>
    </AuthProvider>
  );
}
