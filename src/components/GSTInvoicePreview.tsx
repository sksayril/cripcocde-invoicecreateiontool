import React, { useRef } from 'react';
import { useGSTInvoice } from '../contexts/GSTInvoiceContext';
import { Download, Share2 } from 'lucide-react';

const GSTInvoicePreview: React.FC = () => {
  const { invoice } = useGSTInvoice();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContents = invoiceRef.current?.innerHTML || '';
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            @media print {
              body {
                font-family: 'Helvetica', 'Arial', sans-serif;
                color: #333;
                line-height: 1.5;
              }
              .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
              }
              th, td {
                padding: 8px;
                text-align: left;
                border: 1px solid #ddd;
              }
              th {
                background-color: #f8f9fa;
              }
              .text-right {
                text-align: right;
              }
              .font-bold {
                font-weight: bold;
              }
              .mb-4 {
                margin-bottom: 1rem;
              }
              .mt-4 {
                margin-top: 1rem;
              }
              .border-t {
                border-top: 1px solid #ddd;
              }
              .total-section {
                margin-top: 1rem;
                border-top: 2px solid #ddd;
                padding-top: 1rem;
              }
              .signature-section {
                margin-top: 3rem;
                text-align: right;
              }
              .signature-image {
                max-height: 60px;
                margin-bottom: 0.5rem;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${printContents}
          </div>
          <script>
            window.onload = function() { window.print(); window.history.back(); };
          </script>
        </body>
      </html>
    `;

    window.print();
    document.body.innerHTML = originalContents;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">GST Invoice Preview</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Save PDF
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      <div className="p-8" ref={invoiceRef}>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {invoice.companyLogo && (
              <img
                src={invoice.companyLogo}
                alt="Company Logo"
                className="h-16 max-w-xs object-contain mb-4"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900">TAX INVOICE</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-600">
              <span className="font-semibold">Invoice No:</span> {invoice.invoiceNumber}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Date:</span> {new Date(invoice.invoiceDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Seller and Buyer Information */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Seller Details:</h2>
            <p className="font-medium">{invoice.sellerName}</p>
            <p className="text-sm text-gray-600">{invoice.sellerAddress}</p>
            <p className="text-sm text-gray-600">
              {invoice.sellerState} - {invoice.sellerStateCode}
            </p>
            <p className="text-sm text-gray-600">GSTIN: {invoice.sellerGstin}</p>
            {invoice.sellerPhone && (
              <p className="text-sm text-gray-600">Phone: {invoice.sellerPhone}</p>
            )}
            {invoice.sellerEmail && (
              <p className="text-sm text-gray-600">Email: {invoice.sellerEmail}</p>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Buyer Details:</h2>
            <p className="font-medium">{invoice.buyerName}</p>
            <p className="text-sm text-gray-600">{invoice.buyerAddress}</p>
            <p className="text-sm text-gray-600">
              {invoice.buyerState} - {invoice.buyerStateCode}
            </p>
            {invoice.buyerGstin && (
              <p className="text-sm text-gray-600">GSTIN: {invoice.buyerGstin}</p>
            )}
            {invoice.buyerPhone && (
              <p className="text-sm text-gray-600">Phone: {invoice.buyerPhone}</p>
            )}
            {invoice.buyerEmail && (
              <p className="text-sm text-gray-600">Email: {invoice.buyerEmail}</p>
            )}
          </div>
        </div>

        {/* Supply Details */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Place of Supply:</span> {invoice.placeOfSupply}
          </p>
        </div>

        {/* Items Table */}
        <table className="min-w-full border border-gray-200 mb-6">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HSN/SAC
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              {invoice.isInterState ? (
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IGST
                </th>
              ) : (
                <>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CGST
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SGST
                  </th>
                </>
              )}
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{item.hsnCode}</td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                  ₹{item.unitPrice.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                  ₹{item.taxableValue.toFixed(2)}
                </td>
                {invoice.isInterState ? (
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {item.igstPercent}% (₹{item.igstAmount.toFixed(2)})
                  </td>
                ) : (
                  <>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {item.cgstPercent}% (₹{item.cgstAmount.toFixed(2)})
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {item.sgstPercent}% (₹{item.sgstAmount.toFixed(2)})
                    </td>
                  </>
                )}
                <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                  ₹{item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-96">
            <div className="border-t border-gray-200 pt-4">
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Subtotal:</dt>
                  <dd className="text-gray-900 font-medium">₹{invoice.subTotal.toFixed(2)}</dd>
                </div>
                {invoice.isInterState ? (
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">IGST Total:</dt>
                    <dd className="text-gray-900 font-medium">₹{invoice.igstTotal.toFixed(2)}</dd>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-600">CGST Total:</dt>
                      <dd className="text-gray-900 font-medium">₹{invoice.cgstTotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-600">SGST Total:</dt>
                      <dd className="text-gray-900 font-medium">₹{invoice.sgstTotal.toFixed(2)}</dd>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
                  <dt className="text-gray-900">Total GST:</dt>
                  <dd className="text-gray-900">₹{invoice.totalGst.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between text-base font-bold border-t-2 border-gray-900 pt-2">
                  <dt className="text-gray-900">Grand Total:</dt>
                  <dd className="text-gray-900">₹{invoice.grandTotal.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        {invoice.bankDetails && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Bank Details:</h2>
            <div className="text-sm text-gray-600">
              <p>Account Name: {invoice.bankDetails.accountName}</p>
              <p>Account Number: {invoice.bankDetails.accountNumber}</p>
              <p>Bank Name: {invoice.bankDetails.bankName}</p>
              <p>Branch: {invoice.bankDetails.branchName}</p>
              <p>IFSC Code: {invoice.bankDetails.ifscCode}</p>
            </div>
          </div>
        )}

        {/* Terms and Notes */}
        {invoice.termsAndConditions && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Terms and Conditions:</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {invoice.termsAndConditions}
            </p>
          </div>
        )}

        {invoice.notes && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Notes:</h2>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Signature */}
        <div className="mt-8 text-right">
          {invoice.authorizedSignatory && (
            <img
              src={invoice.authorizedSignatory}
              alt="Authorized Signature"
              className="inline-block h-16 object-contain mb-2"
            />
          )}
          <p className="text-sm font-medium text-gray-900">
            {invoice.authorizedSignatoryName}
          </p>
          <p className="text-sm text-gray-600">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
};

export default GSTInvoicePreview;
