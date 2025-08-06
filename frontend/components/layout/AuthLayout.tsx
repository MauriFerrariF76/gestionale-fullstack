// components/layout/AuthLayout.tsx
"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  className = "",
  title,
  subtitle,
  showLogo = true,
}) => {
  return (
    <div className={`min-h-screen bg-neutral-800 text-neutral-100 flex ${className}`}>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Auth Header */}
        <header className="bg-neutral-800 border-b border-neutral-600 px-8 py-4">
          <div className="flex items-center justify-between">
            {showLogo && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FP</span>
                </div>
                <div>
                  <div className="text-lg font-semibold text-neutral-50">
                    FERRARI PIETRO SNC
                  </div>
                  <div className="text-xs text-neutral-400">
                    Sistema Gestionale
                  </div>
                </div>
              </div>
            )}
            {(title || subtitle) && (
              <div className="text-right">
                {title && (
                  <h2 className="text-xl font-semibold text-neutral-50">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-sm text-neutral-400">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Auth Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout; 