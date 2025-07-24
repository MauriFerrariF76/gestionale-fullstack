// components/Sidebar.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const pathname = usePathname();

  // Configurazione menu - facilmente espandibile
  const navigationItems: NavItem[] = [
    {
      href: "/",
      label: "Dashboard", 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="9" x2="15" y2="9" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      ),
    },
    {
      href: "/commesse",
      label: "Commesse",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4" />
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
      ),
    },
    {
      href: "/dipendenti",
      label: "Dipendenti",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      href: "/clienti",
      label: "Clienti",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
    },
    {
      href: "/fornitori",
      label: "Fornitori",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      href: "/documenti",
      label: "Documenti",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      ),
    },
    {
      href: "/impostazioni",
      label: "Impostazioni",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  // Controlla se un path è attivo
  const isActivePath = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Componente per singolo item di navigazione
  const NavigationItem: React.FC<{ item: NavItem }> = ({ item }) => {
    const isActive = isActivePath(item.href);
    
    return (
      <Link
        href={item.href}
        className={`group cursor-pointer flex items-center space-x-3 p-3 rounded-md transition-all duration-200 ${
          isActive
            ? "bg-neutral-700/50 transform scale-[0.98]" 
            : "hover:bg-neutral-700/50 hover:transform hover:scale-[0.98] active:scale-[0.96]"
        }`}
      >
        <div className={`${isActive ? "text-[#3B82F6]" : "text-neutral-400"}`}>
          {item.icon}
        </div>
        <span
          className={`text-sm font-medium ${
            isActive
              ? "text-[#3B82F6]"
              : "text-neutral-300 group-hover:text-neutral-100"
          }`}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <aside className={`w-64 bg-neutral-850 border-r border-neutral-600 flex flex-col ${className}`}>
      {/* Header Sidebar */}
      <div className="p-6 border-b border-neutral-600">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-8 flex items-center">
            <Image
              src="/ferrari-pietro-logo.png"
              alt="Ferrari Pietro Snc"
              width={48}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xs font-semibold text-neutral-200 leading-tight">
              FERRARI PIETRO SNC
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">Gestionale</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <NavigationItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-neutral-600">
        <div className="text-xs text-neutral-500 text-center">
          v1.0 • <span className="text-[#3B82F6]">Sistema Online</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;