import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileIcon, ListIcon, DownloadIcon } from 'lucide-react';
import { useAuthStore } from '@/lib/store'; // Use Zustand, not context

const Sidebar = () => {
  const location = useLocation();
  const currentUser = useAuthStore(state => state.currentUser);

  const navItems = [
    { name: 'Importer un fichier Excel', href: '/import', icon: FileIcon, disableForConsul: true },
    { name: 'Liste des motos', href: '/motorcycles', icon: ListIcon },
    { name: 'Export', href: '/output', icon: DownloadIcon },
  ];

  return (
    <div className="flex h-screen flex-col bg-sidebar border-r border-border">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-sidebar-primary-foreground">Base de données motos</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const isDisabled = item.disableForConsul && currentUser?.droit === 'consul';
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
                title="Vous n'avez pas la permission d'importer des fichiers"
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
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
