import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateInvoiceNumber } from '../utils/helpers';

export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  logoUrl: string;
}

export interface ClientInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PaymentInfo {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: 'unpaid' | 'partial' | 'paid';
  currency: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  dateIssued: string;
  dateDue: string;
  company: CompanyInfo;
  client: ClientInfo;
  items: LineItem[];
  payment: PaymentInfo;
  notes: string;
}

const defaultCompany: CompanyInfo = {
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: '',
  email: '',
  logoUrl: '',
};

const defaultClient: ClientInfo = {
  name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: '',
};

const defaultPayment: PaymentInfo = {
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  total: 0,
  amountPaid: 0,
  balanceDue: 0,
  status: 'unpaid',
  currency: 'USD'
};

const defaultInvoice: InvoiceData = {
  invoiceNumber: generateInvoiceNumber(),
  dateIssued: new Date().toISOString().split('T')[0],
  dateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  company: defaultCompany,
  client: defaultClient,
  items: [],
  payment: defaultPayment,
  notes: '',
};

interface InvoiceContextType {
  invoice: InvoiceData;
  updateInvoice: (invoice: Partial<InvoiceData>) => void;
  updateCompany: (company: Partial<CompanyInfo>) => void;
  updateClient: (client: Partial<ClientInfo>) => void;
  addItem: (item: Omit<LineItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<LineItem>) => void;
  removeItem: (id: string) => void;
  updatePayment: (payment: Partial<PaymentInfo>) => void;
  calculateTotals: () => void;
  resetInvoice: () => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoice, setInvoice] = useState<InvoiceData>(defaultInvoice);

  const updateInvoice = (data: Partial<InvoiceData>) => {
    setInvoice(prev => ({ ...prev, ...data }));
  };

  const updateCompany = (data: Partial<CompanyInfo>) => {
    setInvoice(prev => ({
      ...prev,
      company: { ...prev.company, ...data },
    }));
  };

  const updateClient = (data: Partial<ClientInfo>) => {
    setInvoice(prev => ({
      ...prev,
      client: { ...prev.client, ...data },
    }));
  };

  const addItem = (item: Omit<LineItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };

    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    
    calculateTotals();
  };

  const updateItem = (id: string, itemData: Partial<LineItem>) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, ...itemData } : item
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

  const updatePayment = (data: Partial<PaymentInfo>) => {
    setInvoice(prev => ({
      ...prev,
      payment: { ...prev.payment, ...data },
    }));
  };

  const calculateTotals = () => {
    setInvoice(prev => {
      const subtotal = prev.items.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = subtotal * (prev.payment.taxRate / 100);
      const total = subtotal + taxAmount;
      const balanceDue = total - prev.payment.amountPaid;
      
      let status: 'unpaid' | 'partial' | 'paid' = 'unpaid';
      if (balanceDue <= 0) {
        status = 'paid';
      } else if (prev.payment.amountPaid > 0) {
        status = 'partial';
      }
      
      return {
        ...prev,
        payment: {
          ...prev.payment,
          subtotal,
          taxAmount,
          total,
          balanceDue,
          status,
        },
      };
    });
  };

  const resetInvoice = () => {
    setInvoice({
      ...defaultInvoice,
      invoiceNumber: generateInvoiceNumber(),
      dateIssued: new Date().toISOString().split('T')[0],
      dateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  return (
    <InvoiceContext.Provider value={{
      invoice,
      updateInvoice,
      updateCompany,
      updateClient,
      addItem,
      updateItem,
      removeItem,
      updatePayment,
      calculateTotals,
      resetInvoice
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};