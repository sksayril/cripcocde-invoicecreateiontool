import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateInvoiceNumber } from '../utils/helpers';

export interface Item {
  id: string;
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxableValue: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  igstPercent: number;
  igstAmount: number;
  total: number;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
}

export interface GSTInvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  // Seller Details
  sellerName: string;
  sellerGstin: string;
  sellerAddress: string;
  sellerState: string;
  sellerStateCode: string;
  sellerPhone: string;
  sellerEmail: string;
  companyLogo?: string;
  
  // Buyer Details
  buyerName: string;
  buyerGstin: string;
  buyerAddress: string;
  buyerState: string;
  buyerStateCode: string;
  buyerPhone: string;
  buyerEmail: string;
  
  // Supply Details
  placeOfSupply: string;
  isInterState: boolean;
  
  // Items and Amounts
  items: Item[];
  subTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  totalGst: number;
  grandTotal: number;
  
  // Payment Details
  paymentMode: 'cash' | 'cheque' | 'upi' | 'netbanking' | 'other';
  bankDetails?: BankDetails;
  
  // Additional Details
  notes: string;
  termsAndConditions: string;
  authorizedSignatory?: string;
  authorizedSignatoryName: string;
}

interface GSTInvoiceContextType {
  invoice: GSTInvoiceData;
  updateInvoice: (data: Partial<GSTInvoiceData>) => void;
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  removeItem: (id: string) => void;
  calculateTotals: () => void;
  resetInvoice: () => void;
}

const defaultBankDetails: BankDetails = {
  accountName: '',
  accountNumber: '',
  bankName: '',
  branchName: '',
  ifscCode: '',
};

const defaultInvoice: GSTInvoiceData = {
  invoiceNumber: generateInvoiceNumber(),
  invoiceDate: new Date().toISOString().split('T')[0],
  sellerName: '',
  sellerGstin: '',
  sellerAddress: '',
  sellerState: '',
  sellerStateCode: '',
  sellerPhone: '',
  sellerEmail: '',
  buyerName: '',
  buyerGstin: '',
  buyerAddress: '',
  buyerState: '',
  buyerStateCode: '',
  buyerPhone: '',
  buyerEmail: '',
  placeOfSupply: '',
  isInterState: false,
  items: [],
  subTotal: 0,
  cgstTotal: 0,
  sgstTotal: 0,
  igstTotal: 0,
  totalGst: 0,
  grandTotal: 0,
  paymentMode: 'cash',
  notes: '',
  termsAndConditions: '',
  authorizedSignatoryName: '',
};

const GSTInvoiceContext = createContext<GSTInvoiceContextType | undefined>(undefined);

export const useGSTInvoice = () => {
  const context = useContext(GSTInvoiceContext);
  if (!context) {
    throw new Error('useGSTInvoice must be used within a GSTInvoiceProvider');
  }
  return context;
};

export const GSTInvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoice, setInvoice] = useState<GSTInvoiceData>(defaultInvoice);

  const updateInvoice = (data: Partial<GSTInvoiceData>) => {
    setInvoice(prev => ({ ...prev, ...data }));
  };

  const calculateItemTotals = (item: Item): Item => {
    const taxableValue = item.quantity * item.unitPrice;
    
    if (invoice.isInterState) {
      const igstAmount = (taxableValue * item.igstPercent) / 100;
      return {
        ...item,
        taxableValue,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount,
        total: taxableValue + igstAmount,
      };
    } else {
      const cgstAmount = (taxableValue * item.cgstPercent) / 100;
      const sgstAmount = (taxableValue * item.sgstPercent) / 100;
      return {
        ...item,
        taxableValue,
        cgstAmount,
        sgstAmount,
        igstAmount: 0,
        total: taxableValue + cgstAmount + sgstAmount,
      };
    }
  };

  const addItem = (item: Omit<Item, 'id'>) => {
    const newItem = calculateItemTotals({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    });

    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    
    calculateTotals();
  };

  const updateItem = (id: string, itemData: Partial<Item>) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id 
          ? calculateItemTotals({ ...item, ...itemData })
          : item
      ),
    }));
    
    calculateTotals();
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
    
    calculateTotals();
  };

  const calculateTotals = () => {
    setInvoice(prev => {
      const subTotal = prev.items.reduce((sum, item) => sum + item.taxableValue, 0);
      const cgstTotal = prev.items.reduce((sum, item) => sum + item.cgstAmount, 0);
      const sgstTotal = prev.items.reduce((sum, item) => sum + item.sgstAmount, 0);
      const igstTotal = prev.items.reduce((sum, item) => sum + item.igstAmount, 0);
      const totalGst = cgstTotal + sgstTotal + igstTotal;
      const grandTotal = subTotal + totalGst;

      return {
        ...prev,
        subTotal,
        cgstTotal,
        sgstTotal,
        igstTotal,
        totalGst,
        grandTotal,
      };
    });
  };

  const resetInvoice = () => {
    setInvoice({
      ...defaultInvoice,
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <GSTInvoiceContext.Provider value={{
      invoice,
      updateInvoice,
      addItem,
      updateItem,
      removeItem,
      calculateTotals,
      resetInvoice,
    }}>
      {children}
    </GSTInvoiceContext.Provider>
  );
};
