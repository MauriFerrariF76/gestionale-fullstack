import React from "react";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
 
export function SidebarWithBurgerMenu() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
 
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
 
  return (
    <>
      <button
        className="p-2 text-neutral-400 hover:text-neutral-200 transition-colors"
        onClick={openDrawer}
      >
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2" />
        )}
      </button>
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg">
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-blue-500 rounded"></div>
                  <h5 className="text-lg font-semibold text-gray-900">
                    Sidebar
                  </h5>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Menu</div>
                <div className="space-y-2">
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    Dashboard
                  </div>
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    Analytics
                  </div>
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    Reporting
                  </div>
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    Projects
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}