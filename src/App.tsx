import React from 'react';
import { Router } from './components/Router';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <InvoiceProvider>
          <Router />
        </InvoiceProvider>
      </AuthProvider>
    </div>
  );
}

export default App;