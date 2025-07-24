import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const hideBottomNav = ['/checkout'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className={`pt-16 ${!hideBottomNav ? 'pb-20' : 'pb-4'}`}>
        {children}
      </main>
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
}