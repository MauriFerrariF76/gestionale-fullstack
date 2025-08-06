// components/layout/SimpleLayout.tsx
"use client";

import React from "react";

interface SimpleLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({
  children,
  className = "",
  title,
  subtitle,
  actions,
}) => {
  return (
    <div className={`min-h-screen bg-neutral-800 text-neutral-100 flex ${className}`}>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Optional Header */}
        {(title || actions) && (
          <header className="bg-neutral-800 border-b border-neutral-600 px-8 py-4 flex items-center justify-between">
            {(title || subtitle) && (
              <div>
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
            {actions && (
              <div className="flex items-center space-x-4">
                {actions}
              </div>
            )}
          </header>
        )}

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SimpleLayout; 