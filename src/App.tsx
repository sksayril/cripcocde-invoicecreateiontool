import React from 'react';
import { Router } from './components/Router';
import { InvoiceProvider } from './contexts/InvoiceContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <InvoiceProvider>
        <Router />
      </InvoiceProvider>
    </div>
  );
}

export default App;