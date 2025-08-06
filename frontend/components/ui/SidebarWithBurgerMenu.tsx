// components/ui/SidebarWithBurgerMenu.tsx
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { X, Menu, Search, ChevronDown, ChevronRight } from "lucide-react";
import Button from "./Button";
import Input from "./Input";

// Icons - usando lucide-react per consistenza con il progetto
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="9" x2="15" y2="9" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

const ECommerceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const InboxIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// Interfaces
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
  children?: MenuItem[];
}

interface SidebarWithBurgerMenuProps {
  className?: string;
  brandName?: string;
  brandLogo?: string;
  menuItems?: MenuItem[];
  onItemClick?: (item: MenuItem) => void;
  onLogout?: () => void;
}

// Default menu items seguendo la struttura del progetto
const defaultMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    href: "/",
    children: [
      { id: "analytics", label: "Analytics", icon: <ChevronRight className="w-3 h-3" />, href: "/analytics" },
      { id: "reporting", label: "Reporting", icon: <ChevronRight className="w-3 h-3" />, href: "/reporting" },
      { id: "projects", label: "Projects", icon: <ChevronRight className="w-3 h-3" />, href: "/projects" }
    ]
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    icon: <ECommerceIcon />,
    href: "/ecommerce",
    children: [
      { id: "orders", label: "Orders", icon: <ChevronRight className="w-3 h-3" />, href: "/orders" },
      { id: "products", label: "Products", icon: <ChevronRight className="w-3 h-3" />, href: "/products" }
    ]
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: <InboxIcon />,
    href: "/inbox",
    badge: "14"
  },
  {
    id: "profile",
    label: "Profile",
    icon: <UserIcon />,
    href: "/profile"
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon />,
    href: "/settings"
  }
];

export function SidebarWithBurgerMenu({
  className,
  brandName = "Ferrari Pietro SNC",
  brandLogo = "/ferrari-pietro-logo.png",
  menuItems = defaultMenuItems,
  onItemClick,
  onLogout
}: SidebarWithBurgerMenuProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const toggleAccordion = (itemId: string) => {
    setOpenAccordions(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      toggleAccordion(item.id);
    } else {
      onItemClick?.(item);
      // Se è mobile, chiudi il drawer dopo il click
      if (window.innerWidth < 768) {
        closeDrawer();
      }
    }
  };

  const handleLogout = () => {
    onLogout?.();
    closeDrawer();
  };

  // Componente per singolo menu item
  const MenuItem: React.FC<{ item: MenuItem; isChild?: boolean }> = ({ item, isChild = false }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openAccordions.includes(item.id);

    return (
      <div>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200",
            "hover:bg-neutral-700/50 text-neutral-300 hover:text-neutral-100",
            "focus:outline-none focus:bg-neutral-700/50",
            isChild && "pl-6 py-2 text-sm",
            !isChild && hasChildren && isOpen && "bg-neutral-700/30"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="text-neutral-400">
              {item.icon}
            </div>
            <span className="font-medium">
              {item.label}
            </span>
            {item.badge && (
              <span className="ml-auto bg-neutral-600 text-neutral-300 text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          
          {hasChildren && (
            <ChevronDown 
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          )}
        </button>

        {/* Submenu */}
        {hasChildren && (
          <div className={cn(
            "overflow-hidden transition-all duration-200",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="py-1">
              {item.children?.map(child => (
                <MenuItem key={child.id} item={child} isChild />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Burger Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={openDrawer}
        className="p-2"
      >
        {isDrawerOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </Button>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer/Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-neutral-800 border-r border-neutral-600/60 z-50",
          "transition-transform duration-300 ease-in-out",
          "w-80 max-w-[85vw]",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-4 p-6 border-b border-neutral-600/60">
            {brandLogo && (
              <img
                src={brandLogo}
                alt={brandName}
                className="h-8 w-8 object-contain"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold text-neutral-200">
                {brandName}
              </h2>
              <p className="text-sm text-neutral-400">Gestionale</p>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <Input
              placeholder="Cerca..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="w-full"
            />
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 overflow-y-auto">
            <div className="space-y-1">
              {menuItems
                .filter(item => 
                  searchValue === "" || 
                  item.label.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map(item => (
                  <MenuItem key={item.id} item={item} />
                ))
              }
            </div>

            {/* Separator */}
            <div className="my-4 border-t border-neutral-600/60" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-neutral-700/50 text-neutral-300 hover:text-neutral-100 focus:outline-none focus:bg-neutral-700/50"
            >
              <LogoutIcon />
              <span className="font-medium">Log Out</span>
            </button>
          </nav>

          {/* Upgrade Alert */}
          {showUpgradeAlert && (
            <div className="p-4 m-4 bg-neutral-700/40 border border-neutral-600/40 rounded-lg">
              <button
                onClick={() => setShowUpgradeAlert(false)}
                className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="mb-3 text-[#3B82F6]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              
              <h3 className="font-semibold text-neutral-200 mb-1">
                Upgrade to PRO
              </h3>
              <p className="text-sm text-neutral-400 mb-3">
                Upgrade to Ferrari Pietro PRO and get even more features, analytics and premium tools.
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUpgradeAlert(false)}
                  className="text-neutral-400 hover:text-neutral-200"
                >
                  Dismiss
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-sm"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SidebarWithBurgerMenu;