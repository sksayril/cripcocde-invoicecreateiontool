import React, { useRef } from 'react';
import { useGSTInvoice } from '../../contexts/GSTInvoiceContext';
import { Upload } from 'lucide-react';

const AdditionalDetails: React.FC = () => {
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
        updateInvoice({ authorizedSignatory: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const defaultTerms = `1. Payment is due within 30 days
2. Goods once sold will not be taken back
3. Interest @18% p.a. will be charged on delayed payments
4. Subject to local jurisdiction
5. E. & O.E.`;

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h2>
      <p className="text-sm text-gray-500 mb-6">
        Add terms and conditions, notes, and authorized signatory details
      </p>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="termsAndConditions" className="block text-sm font-medium text-gray-700 mb-1">
            Terms and Conditions
          </label>
          <textarea
            id="termsAndConditions"
            name="termsAndConditions"
            rows={6}
            value={invoice.termsAndConditions || defaultTerms}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter terms and conditions"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={invoice.notes}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Any additional notes or comments"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Authorized Signatory
          </label>
          <div className="mt-1 flex flex-col items-center space-y-4">
            {invoice.authorizedSignatory ? (
              <div className="relative group">
                <img 
                  src={invoice.authorizedSignatory}
                  alt="Authorized Signatory"
                  className="h-32 object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                  >
                    Change Signature
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload signature image</span>
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

        <div>
          <label htmlFor="authorizedSignatoryName" className="block text-sm font-medium text-gray-700 mb-1">
            Name of Authorized Signatory
          </label>
          <input
            type="text"
            id="authorizedSignatoryName"
            name="authorizedSignatoryName"
            value={invoice.authorizedSignatoryName}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter name of the authorized person"
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetails;
