
import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen">
      <div className="w-64 shrink-0">
        <Sidebar />
      </div>
      <div className="flex-grow overflow-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
