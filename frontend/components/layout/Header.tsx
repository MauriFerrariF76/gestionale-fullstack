import React from 'react';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className = '',
}) => {
  return (
    <header className={cn(
      "bg-neutral-700/60 border-b border-neutral-600/60 px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center space-x-2 text-sm text-neutral-400 mb-2">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span className="text-neutral-500">/</span>
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-neutral-300 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-neutral-300">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Title and Subtitle */}
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-white">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-neutral-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 