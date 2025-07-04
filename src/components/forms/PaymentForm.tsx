import React from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';
import { formatCurrency, currencies } from '../../utils/helpers';
import { CreditCard, DollarSign } from 'lucide-react';

const PaymentForm: React.FC = () => {
  const { invoice, updatePayment, calculateTotals } = useInvoice();
  const { payment } = invoice;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericValue = name === 'taxRate' || name === 'amountPaid' ? parseFloat(value) : value;
    
    updatePayment({ [name]: numericValue });
    if (name !== 'currency') {
      calculateTotals();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
      <p className="text-sm text-gray-500 mb-6">
        Configure tax rates, currency, and payment status.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <DollarSign className="h-4 w-4" />
            </span>
            <select
              name="currency"
              id="currency"
              value={payment.currency}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {Object.entries(currencies).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
            Tax Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            name="taxRate"
            id="taxRate"
            value={payment.taxRate}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-1">
            Amount Already Paid
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <CreditCard className="h-4 w-4" />
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              name="amountPaid"
              id="amountPaid"
              value={payment.amountPaid}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <h3 className="text-base font-medium text-gray-900 mb-4">Invoice Summary</h3>
        <dl className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <dt className="text-sm text-gray-600">Subtotal:</dt>
            <dd className="text-sm font-medium text-gray-900">{formatCurrency(payment.subtotal, payment.currency)}</dd>
          </div>
          <div className="flex justify-between items-center py-2">
            <dt className="text-sm text-gray-600">Tax ({payment.taxRate}%):</dt>
            <dd className="text-sm font-medium text-gray-900">{formatCurrency(payment.taxAmount, payment.currency)}</dd>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <dt className="text-sm font-medium text-gray-900">Total:</dt>
            <dd className="text-sm font-medium text-gray-900">{formatCurrency(payment.total, payment.currency)}</dd>
          </div>
          <div className="flex justify-between items-center py-2">
            <dt className="text-sm text-gray-600">Amount Paid:</dt>
            <dd className="text-sm font-medium text-gray-900">{formatCurrency(payment.amountPaid, payment.currency)}</dd>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <dt className="text-lg font-bold text-gray-900">Balance Due:</dt>
            <dd className="text-lg font-bold text-gray-900">{formatCurrency(payment.balanceDue, payment.currency)}</dd>
          </div>
          <div className="pt-2 flex justify-between items-center">
            <dt className="text-sm text-gray-600">Status:</dt>
            <dd>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  payment.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : payment.status === 'partial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {payment.status === 'paid'
                  ? 'Paid'
                  : payment.status === 'partial'
                  ? 'Partially Paid'
                  : 'Unpaid'}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default PaymentForm;