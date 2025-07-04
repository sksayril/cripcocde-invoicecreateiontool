import React, { useRef } from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';
import { Building2, Mail, MapPin, Phone, Image, Upload } from 'lucide-react';

const CompanyForm: React.FC<{ onNext?: () => void }> = ({ onNext }) => {
  const { invoice, updateCompany } = useInvoice();
  const { company } = invoice;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateCompany({ [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCompany({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = (): boolean => {
    return !!company.name;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Company Information</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your company details to be displayed on the invoice.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Logo
          </label>
          <div className="mt-1 flex flex-col items-center space-y-4">
            {company.logoUrl ? (
              <div className="relative group">
                <div className="h-32 w-full overflow-hidden bg-gray-100 rounded-lg flex items-center justify-center">
                  <img 
                    src={company.logoUrl} 
                    alt="Company Logo" 
                    className="max-h-full max-w-full object-contain p-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=Logo+Error';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Change Logo
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload company logo</span>
                <span className="text-xs text-gray-400 mt-1">or paste image URL below</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              type="text"
              name="logoUrl"
              value={company.logoUrl}
              onChange={handleChange}
              placeholder="Or enter logo URL: https://example.com/logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name*
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Building2 className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="name"
              id="name"
              value={company.name}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Your Company Name"
              required
            />
          </div>
        </div>

        <div className="col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <MapPin className="h-4 w-4" />
            </span>
            <input
              type="text"
              name="address"
              id="address"
              value={company.address}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="123 Business St"
            />
          </div>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            id="city"
            value={company.city}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="City"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State / Province
          </label>
          <input
            type="text"
            name="state"
            id="state"
            value={company.state}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="State"
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            ZIP / Postal Code
          </label>
          <input
            type="text"
            name="zipCode"
            id="zipCode"
            value={company.zipCode}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="12345"
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            name="country"
            id="country"
            value={company.country}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Country"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              name="email"
              id="email"
              value={company.email}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="company@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Phone className="h-4 w-4" />
            </span>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={company.phone}
              onChange={handleChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="(123) 456-7890"
            />
          </div>
        </div>
      </div>

      {onNext && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onNext}
            disabled={!isFormValid()}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isFormValid()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Next: Client Information
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyForm;