import React, { useState } from 'react';
import { useInvoice } from '../contexts/InvoiceContext';
import CompanyForm from './forms/CompanyForm';
import ClientForm from './forms/ClientForm';
import InvoiceDetailsForm from './forms/InvoiceDetailsForm';
import ItemsForm from './forms/ItemsForm';
import PaymentForm from './forms/PaymentForm';
import { AlertCircle, Save, ChevronRight } from 'lucide-react';

const InvoiceCreator: React.FC = () => {
  const { invoice, calculateTotals } = useInvoice();
  const [activeTab, setActiveTab] = useState<string>('company');
  const [errors, setErrors] = useState<string[]>([]);

  const validateInvoice = (): boolean => {
    const newErrors: string[] = [];
    
    if (!invoice.company.name) newErrors.push('Company name is required');
    if (!invoice.client.name) newErrors.push('Client name is required');
    if (invoice.items.length === 0) newErrors.push('At least one item is required');
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSaveInvoice = () => {
    calculateTotals();
    if (validateInvoice()) {
      console.log('Invoice is valid and ready for preview');
    }
  };

  const handleNext = () => {
    const tabs = ['company', 'client', 'details', 'items', 'payment'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const isTabComplete = (tab: string): boolean => {
    switch (tab) {
      case 'company':
        return !!invoice.company.name;
      case 'client':
        return !!invoice.client.name;
      case 'details':
        return !!invoice.invoiceNumber;
      case 'items':
        return invoice.items.length > 0;
      case 'payment':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['company', 'client', 'details', 'items', 'payment'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              disabled={index > 0 && !isTabComplete('company')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap focus:outline-none flex items-center space-x-2 ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : isTabComplete(tab)
                  ? 'text-green-600 hover:text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              } ${index > 0 && !isTabComplete('company') ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs
                ${isTabComplete(tab)
                  ? 'bg-green-100 text-green-600'
                  : activeTab === tab
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
                }`}
              >
                {index + 1}
              </span>
              <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              {isTabComplete(tab) && (
                <ChevronRight className="h-4 w-4 text-green-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'company' && <CompanyForm onNext={handleNext} />}
        {activeTab === 'client' && <ClientForm onNext={handleNext} />}
        {activeTab === 'details' && <InvoiceDetailsForm onNext={handleNext} />}
        {activeTab === 'items' && <ItemsForm onNext={handleNext} />}
        {activeTab === 'payment' && <PaymentForm />}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveInvoice}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save & Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreator;