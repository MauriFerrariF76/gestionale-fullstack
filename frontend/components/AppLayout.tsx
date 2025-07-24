// components/AppLayout.tsx
"use client";

import React from "react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageDescription: string;
  headerActions?: React.ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  pageTitle,
  pageDescription,
  headerActions,
  className = "",
}) => {
  return (
    <div className={`min-h-screen bg-neutral-800 text-neutral-100 flex ${className}`}>
      {/* Sidebar Universale */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-neutral-800 border-b border-neutral-600 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-50">
              {pageTitle}
            </h2>
            <p className="text-sm text-neutral-400">
              {pageDescription}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {headerActions}
            <div
              className="w-3 h-3 bg-[#3B82F6] rounded-full animate-pulse"
              title="Sistema Online"
            ></div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;