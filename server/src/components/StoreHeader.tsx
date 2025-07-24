import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function StoreHeader() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900">GroMart Store</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-green-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            <Link
              to="/profile"
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                {user?.name}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}