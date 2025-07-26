import React from 'react';
import { FileText, Eye, MoreHorizontal, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentView: 'create' | 'preview' | 'tax-invoice';
  setCurrentView: (view: 'create' | 'preview' | 'tax-invoice') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { logout, user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-800">
              {currentView === 'tax-invoice' ? 'Tax Invoice' : 'Invoice Generator'}
            </span>
            <span className="ml-4 text-sm text-gray-600">Welcome, {user?.name}</span>
          </div>
          
          <nav>
            <ul className="flex space-x-4 items-center">
              <li>
                <button 
                  onClick={() => setCurrentView('tax-invoice')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'tax-invoice' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                  
                    Tax Invoice
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('create')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'create' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                   Invoice Generator
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('preview')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'preview' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;