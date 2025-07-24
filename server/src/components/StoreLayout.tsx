import React from 'react';
import { useLocation } from 'react-router-dom';
import StoreHeader from './StoreHeader';
import StoreNavigation from './StoreNavigation';

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />
      <div className="flex">
        <StoreNavigation />
        <main className="flex-1 ml-64 pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}