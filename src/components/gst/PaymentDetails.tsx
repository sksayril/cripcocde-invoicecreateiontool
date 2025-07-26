import React from 'react';
import { useGSTInvoice } from '../../contexts/GSTInvoiceContext';
import { CreditCard, Building2, Hash } from 'lucide-react';

interface PaymentDetailsProps {
  onNext?: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ onNext }) => {
  const { invoice, updateInvoice } = useGSTInvoice();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateInvoice({ [name]: value });
  };

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateInvoice({
      bankDetails: {
        ...invoice.bankDetails,
        [name]: value,
      },
    });
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>
      <p className="text-sm text-gray-500 mb-6">
        Configure payment mode and bank account details
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Mode
          </label>
          <div className="mt-1">
            <select
              name="paymentMode"
              value={invoice.paymentMode}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="col-span-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-sm text-gray-500">Bank Account Details</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
            Account Name
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Building2 className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="accountName"
              id="accountName"
              value={invoice.bankDetails?.accountName || ''}
              onChange={handleBankDetailsChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Account Holder's Name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Account Number
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Hash className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="accountNumber"
              id="accountNumber"
              value={invoice.bankDetails?.accountNumber || ''}
              onChange={handleBankDetailsChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Account Number"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <CreditCard className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="bankName"
              id="bankName"
              value={invoice.bankDetails?.bankName || ''}
              onChange={handleBankDetailsChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Bank Name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">
            Branch Name
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Building2 className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="branchName"
              id="branchName"
              value={invoice.bankDetails?.branchName || ''}
              onChange={handleBankDetailsChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Branch Name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">
            IFSC Code
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Hash className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="ifscCode"
              id="ifscCode"
              value={invoice.bankDetails?.ifscCode || ''}
              onChange={handleBankDetailsChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="IFSC Code"
              pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Format: ABCD0123456</p>
        </div>
      </div>

      {onNext && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onNext}
            className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700"
          >
            Next: Additional Details
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
