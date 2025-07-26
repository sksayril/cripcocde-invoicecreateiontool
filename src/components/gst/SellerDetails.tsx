import React, { useRef } from 'react';
import { useGSTInvoice } from '../../contexts/GSTInvoiceContext';
import { Building2, Mail, MapPin, Phone, Upload, FileText } from 'lucide-react';

interface SellerDetailsProps {
  onNext?: () => void;
}

const SellerDetails: React.FC<SellerDetailsProps> = ({ onNext }) => {
  const { invoice, updateInvoice } = useGSTInvoice();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateInvoice({ [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateInvoice({ companyLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = (): boolean => {
    return !!invoice.sellerName && !!invoice.sellerGstin;
  };

  const handleNext = () => {
    if (isFormValid() && onNext) {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Seller Details</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your company's details as registered with GST
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Logo */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Logo
          </label>
          <div className="mt-1 flex flex-col items-center space-y-4">
            {invoice.companyLogo ? (
              <div className="relative group">
                <img 
                  src={invoice.companyLogo}
                  alt="Company Logo"
                  className="h-32 object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  >
                    Change Logo
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload company logo</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Invoice Details */}
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number*
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <FileText className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="invoiceNumber"
              id="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Date*
          </label>
          <input
            type="date"
            name="invoiceDate"
            id="invoiceDate"
            value={invoice.invoiceDate}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Company Details */}
        <div className="col-span-2">
          <label htmlFor="sellerName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name*
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Building2 className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="sellerName"
              id="sellerName"
              value={invoice.sellerName}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Legal Company Name"
              required
            />
          </div>
        </div>

        <div className="col-span-2">
          <label htmlFor="sellerGstin" className="block text-sm font-medium text-gray-700 mb-1">
            GSTIN*
          </label>
          <input
            type="text"
            name="sellerGstin"
            id="sellerGstin"
            value={invoice.sellerGstin}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="22AAAAA0000A1Z5"
            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
            required
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="sellerAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <MapPin className="h-4 w-4" />
            </span>
            <textarea
              name="sellerAddress"
              id="sellerAddress"
              value={invoice.sellerAddress}
              onChange={handleChange}
              rows={3}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Complete Address"
            />
          </div>
        </div>

        <div>
          <label htmlFor="sellerState" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            name="sellerState"
            id="sellerState"
            value={invoice.sellerState}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="State Name"
          />
        </div>

        <div>
          <label htmlFor="sellerStateCode" className="block text-sm font-medium text-gray-700 mb-1">
            State Code
          </label>
          <input
            type="text"
            name="sellerStateCode"
            id="sellerStateCode"
            value={invoice.sellerStateCode}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="State Code (e.g., 27)"
            maxLength={2}
            pattern="[0-9]{2}"
          />
        </div>

        <div>
          <label htmlFor="sellerEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              name="sellerEmail"
              id="sellerEmail"
              value={invoice.sellerEmail}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="company@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="sellerPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Phone className="h-4 w-4" />
            </span>
            <input
              type="tel"
              name="sellerPhone"
              id="sellerPhone"
              value={invoice.sellerPhone}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Contact Number"
            />
          </div>
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
            Next: Buyer Details
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerDetails;
