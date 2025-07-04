import React from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';
import { Hash, Calendar, DollarSign } from 'lucide-react';
import { currencies } from '../../utils/helpers';

const InvoiceDetailsForm: React.FC = () => {
  const { invoice, updateInvoice, updatePayment } = useInvoice();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'currency') {
      updatePayment({ currency: value });
    } else {
      updateInvoice({ [name]: value });
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h2>
      <p className="text-sm text-gray-500 mb-6">
        Configure the basic invoice information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Hash className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="invoiceNumber"
              id="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="INV-12345"
            />
          </div>
        </div>

        <div>
          <label htmlFor="dateIssued" className="block text-sm font-medium text-gray-700 mb-1">
            Issue Date
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Calendar className="h-4 w-4" />
            </span>
            <input
              type="date"
              name="dateIssued"
              id="dateIssued"
              value={invoice.dateIssued}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="dateDue" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Calendar className="h-4 w-4" />
            </span>
            <input
              type="date"
              name="dateDue"
              id="dateDue"
              value={invoice.dateDue}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

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
              value={invoice.payment.currency}
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
          <p className="mt-1 text-xs text-gray-500">This will be used throughout your invoice</p>
        </div>

        <div className="col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={invoice.notes}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Additional notes for the client (payment terms, delivery information, etc.)"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsForm;