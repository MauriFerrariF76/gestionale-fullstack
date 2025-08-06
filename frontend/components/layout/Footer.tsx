import React from 'react';
import { cn } from '@/lib/utils';

export interface FooterProps {
  copyright?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  copyright = "© 2025 Gestionale Ferrari Pietro SNC. Tutti i diritti riservati.",
  links,
  className = '',
}) => {
  return (
    <footer className={cn(
      "bg-neutral-700/60 border-t border-neutral-600/60 px-6 py-4 mt-auto",
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Copyright */}
        <div className="text-sm text-neutral-400">
          {copyright}
        </div>

        {/* Links */}
        {links && links.length > 0 && (
          <nav className="flex items-center space-x-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
};

export default Footer; 