import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileIcon, ListIcon, DownloadIcon } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext'; // Update with your context path

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext); // Assumes currentUser is provided in AuthContext

  const navItems = [
    { name: 'Import Excel file', href: '/import', icon: FileIcon, disableForConsul: true },
    { name: 'List of motorcycles', href: '/motorcycles', icon: ListIcon },
    { name: 'Output', href: '/output', icon: DownloadIcon },
  ];

  return (
    <div className="flex h-screen flex-col bg-sidebar border-r border-border">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-sidebar-primary-foreground">Motorcycle Database</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const isDisabled = item.disableForConsul && currentUser?.droit === 'consul';
          console.log('Current user droit:', currentUser?.droit);
          if (isDisabled) {
            return (
              <span
                key={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm opacity-50 cursor-not-allowed select-none",
                  "text-sidebar-foreground"
                )}
                aria-disabled="true"
                tabIndex={-1}
                title="You do not have permission to import files"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
