import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface FormTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  error?: string;
  valid?: boolean;
  pending?: boolean;
}

export interface FormTabsProps {
  tabs: FormTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

const FormTabs: React.FC<FormTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(activeTab || tabs[0]?.id || '');

  const currentActiveTab = activeTab || internalActiveTab;
  const currentTab = tabs.find(tab => tab.id === currentActiveTab);

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const getTabStatusIcon = (tab: FormTab) => {
    if (tab.error) return '❌';
    if (tab.valid) return '✅';
    if (tab.pending) return '⏳';
    return null;
  };

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="border-b border-neutral-700/60 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const isActive = tab.id === currentActiveTab;
            const statusIcon = getTabStatusIcon(tab);
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors",
                  isActive
                    ? "border-[#3B82F6] text-[#3B82F6]"
                    : "border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-600/60"
                )}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
                {statusIcon && <span className="text-xs">{statusIcon}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {currentTab && (
        <div className="space-y-6">
          {currentTab.content}
        </div>
      )}
    </div>
  );
};

export default FormTabs; 