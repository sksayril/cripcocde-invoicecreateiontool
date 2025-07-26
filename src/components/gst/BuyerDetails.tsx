import React from 'react';
import { useGSTInvoice } from '../../contexts/GSTInvoiceContext';
import { User, Mail, MapPin, Phone } from 'lucide-react';

interface BuyerDetailsProps {
  onNext?: () => void;
}

const BuyerDetails: React.FC<BuyerDetailsProps> = ({ onNext }) => {
  const { invoice, updateInvoice } = useGSTInvoice();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateInvoice({ [name]: value });
  };

  const handleGSTINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // When GSTIN is entered, automatically extract and set the state code
    if (value.length >= 2) {
      updateInvoice({ 
        buyerGstin: value,
        buyerStateCode: value.substring(0, 2)
      });
    } else {
      updateInvoice({ buyerGstin: value });
    }
  };

  const isFormValid = (): boolean => {
    return !!invoice.buyerName && !!invoice.buyerAddress;
  };

  const handleNext = () => {
    if (isFormValid() && onNext) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Buyer Details</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter the customer's details for the invoice
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700 mb-1">
            Customer/Company Name*
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <User className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="buyerName"
              id="buyerName"
              value={invoice.buyerName}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Customer or Company Name"
              required
            />
          </div>
        </div>

        <div className="col-span-2">
          <label htmlFor="buyerGstin" className="block text-sm font-medium text-gray-700 mb-1">
            GSTIN (Optional)
          </label>
          <input
            type="text"
            name="buyerGstin"
            id="buyerGstin"
            value={invoice.buyerGstin}
            onChange={handleGSTINChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="22AAAAA0000A1Z5"
            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter valid GSTIN if the buyer is registered under GST
          </p>
        </div>

        <div className="col-span-2">
          <label htmlFor="buyerAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Address*
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <MapPin className="h-4 w-4" />
            </span>
            <textarea
              name="buyerAddress"
              id="buyerAddress"
              value={invoice.buyerAddress}
              onChange={handleChange}
              rows={3}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Complete Address"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="buyerState" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            name="buyerState"
            id="buyerState"
            value={invoice.buyerState}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="State Name"
          />
        </div>

        <div>
          <label htmlFor="buyerStateCode" className="block text-sm font-medium text-gray-700 mb-1">
            State Code
          </label>
          <input
            type="text"
            name="buyerStateCode"
            id="buyerStateCode"
            value={invoice.buyerStateCode}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="State Code (e.g., 27)"
            maxLength={2}
            pattern="[0-9]{2}"
          />
        </div>

        <div>
          <label htmlFor="buyerEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              name="buyerEmail"
              id="buyerEmail"
              value={invoice.buyerEmail}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="customer@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="buyerPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Phone className="h-4 w-4" />
            </span>
            <input
              type="tel"
              name="buyerPhone"
              id="buyerPhone"
              value={invoice.buyerPhone}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Contact Number"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label htmlFor="placeOfSupply" className="block text-sm font-medium text-gray-700 mb-1">
            Place of Supply*
          </label>
          <input
            type="text"
            name="placeOfSupply"
            id="placeOfSupply"
            value={invoice.placeOfSupply}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Place of Supply"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={invoice.isInterState}
              onChange={(e) => updateInvoice({ isInterState: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">This is an inter-state supply</span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Check this if the supply is to a different state. This will determine whether IGST or CGST+SGST is applicable.
          </p>
        </div>
      </div>

      {onNext && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isFormValid()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Next: Add Items
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyerDetails;
