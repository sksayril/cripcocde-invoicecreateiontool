import React, { useState } from 'react';
import InvoiceCreator from './InvoiceCreator';
import InvoicePreview from './InvoicePreview';
import Navbar from './Navbar';

export const Router: React.FC = () => {
  const [currentView, setCurrentView] = useState<'create' | 'preview'>('create');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-grow container mx-auto px-4 py-6">
        {currentView === 'create' ? <InvoiceCreator /> : <InvoicePreview />}
      </div>
    </div>
  );
};