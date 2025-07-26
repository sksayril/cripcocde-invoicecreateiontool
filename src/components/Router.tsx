import React, { useState } from 'react';
import InvoiceCreator from './InvoiceCreator';
import InvoicePreview from './InvoicePreview';
import GSTInvoiceForm from './GSTInvoiceForm';
import Navbar from './Navbar';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext';
import { GSTInvoiceProvider } from '../contexts/GSTInvoiceContext';

type View = 'create' | 'preview' | 'tax-invoice';

export const Router: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<View>('create');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return <InvoiceCreator />;
      case 'preview':
        return <InvoicePreview />;
      case 'tax-invoice':
        return (
          <GSTInvoiceProvider>
            <GSTInvoiceForm />
          </GSTInvoiceProvider>
        );
      default:
        return <InvoiceCreator />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-grow container mx-auto px-4 py-6">
        {renderContent()}
      </div>
    </div>
  );
};