import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { useAuthStore } from '@/lib/store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 shrink-0">
        <Sidebar />
      </div>
      <div className="flex-grow overflow-auto">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="text-sm text-gray-600">
            Welcome, {user?.username || 'User'}
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;