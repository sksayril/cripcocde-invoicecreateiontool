import React from 'react';
import { useGSTInvoice } from '../contexts/GSTInvoiceContext';
import SellerDetails from './gst/SellerDetails';
import BuyerDetails from './gst/BuyerDetails';
import ItemsList from './gst/ItemsList';
import PaymentDetails from './gst/PaymentDetails';
import AdditionalDetails from './gst/AdditionalDetails';
import { Save, Printer, ChevronRight } from 'lucide-react';

const GSTInvoiceForm: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'seller' | 'buyer' | 'items' | 'payment' | 'additional'>('seller');
  const { invoice, calculateTotals } = useGSTInvoice();

  const handlePrint = () => {
    window.print();
  };

  const isTabComplete = (tab: string): boolean => {
    switch (tab) {
      case 'seller':
        return !!invoice.sellerName && !!invoice.sellerGstin;
      case 'buyer':
        return !!invoice.buyerName && !!invoice.buyerAddress;
      case 'items':
        return invoice.items.length > 0;
      case 'payment':
        return true;
      case 'additional':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const tabs: Array<'seller' | 'buyer' | 'items' | 'payment' | 'additional'> = 
      ['seller', 'buyer', 'items', 'payment', 'additional'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === 'seller' 
                ? 'border-blue-500 text-blue-600'
                : isTabComplete('seller')
                ? 'border-transparent text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Seller Details
          </button>
          <button
            onClick={() => setActiveTab('buyer')}
            disabled={!isTabComplete('seller')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === 'buyer'
                ? 'border-blue-500 text-blue-600'
                : isTabComplete('buyer')
                ? 'border-transparent text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            } ${!isTabComplete('seller') ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Buyer Details
          </button>
          <button
            onClick={() => setActiveTab('items')}
            disabled={!isTabComplete('buyer')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === 'items'
                ? 'border-blue-500 text-blue-600'
                : isTabComplete('items')
                ? 'border-transparent text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            } ${!isTabComplete('buyer') ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Items & GST
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            disabled={!isTabComplete('items')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === 'payment'
                ? 'border-blue-500 text-blue-600'
                : isTabComplete('payment')
                ? 'border-transparent text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            } ${!isTabComplete('items') ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Payment Details
          </button>
          <button
            onClick={() => setActiveTab('additional')}
            disabled={!isTabComplete('payment')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === 'additional'
                ? 'border-blue-500 text-blue-600'
                : isTabComplete('additional')
                ? 'border-transparent text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            } ${!isTabComplete('payment') ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Additional Details
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {activeTab === 'seller' && <SellerDetails onNext={handleNext} />}
        {activeTab === 'buyer' && <BuyerDetails onNext={handleNext} />}
        {activeTab === 'items' && <ItemsList onNext={handleNext} />}
        {activeTab === 'payment' && <PaymentDetails onNext={handleNext} />}
        {activeTab === 'additional' && <AdditionalDetails />}

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => {
              calculateTotals();
              handlePrint();
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Preview
          </button>
          
          {activeTab !== 'additional' && (
            <button
              onClick={handleNext}
              disabled={!isTabComplete(activeTab)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          )}
          
          {activeTab === 'additional' && (
            <button
              onClick={() => {
                calculateTotals();
                setActiveTab('items'); // Go back to items to review
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GSTInvoiceForm;
