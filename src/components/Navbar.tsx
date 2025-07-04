import React from 'react';
import { FileText, Eye } from 'lucide-react';

interface NavbarProps {
  currentView: 'create' | 'preview';
  setCurrentView: (view: 'create' | 'preview') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-800">Invoice Generator</span>
          </div>
          
          <nav>
            <ul className="flex space-x-4">
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
                    <FileText className="h-4 w-4 mr-1" />
                    Create
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
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;