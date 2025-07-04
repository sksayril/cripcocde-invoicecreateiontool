export const currencies = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar' }
};

export const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  return `${prefix}-${year}${month}-${randomNum}`;
};

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  // Ensure the currency code exists in our currencies object, fallback to USD if not
  const validCurrencyCode = Object.keys(currencies).includes(currencyCode) ? currencyCode : 'USD';
  
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrencyCode,
      minimumFractionDigits: 2,
    });
    
    return formatter.format(amount);
  } catch {
    // Fallback formatting if Intl formatter fails
    const currency = currencies[validCurrencyCode as keyof typeof currencies];
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getPaymentStatusInfo = (status: string): { label: string; color: string } => {
  switch (status) {
    case 'paid':
      return { label: 'Paid', color: 'bg-green-100 text-green-800' };
    case 'partial':
      return { label: 'Partially Paid', color: 'bg-yellow-100 text-yellow-800' };
    case 'unpaid':
    default:
      return { label: 'Unpaid', color: 'bg-red-100 text-red-800' };
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};