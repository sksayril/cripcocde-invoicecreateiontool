import React, { useRef } from 'react';
import { useInvoice } from '../contexts/InvoiceContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Download, Share2 } from 'lucide-react';

const InvoicePreview: React.FC = () => {
  const { invoice } = useInvoice();
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
              }
              th, td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
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
              .status-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 12px;
              }
              .status-paid {
                background-color: #d1fae5;
                color: #065f46;
              }
              .status-partial {
                background-color: #fef3c7;
                color: #92400e;
              }
              .status-unpaid {
                background-color: #fee2e2;
                color: #b91c1c;
              }
              .logo {
                max-height: 80px;
                max-width: 200px;
              }
              .mb-6 {
                margin-bottom: 24px;
              }
              .mb-4 {
                margin-bottom: 16px;
              }
              .mt-8 {
                margin-top: 32px;
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
    
    // Make sure the print dialog opens
    window.print();
    // Restore the original content after printing
    setTimeout(() => {
      document.body.innerHTML = originalContents;
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Invoice Preview</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Save PDF
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      <div className="p-8" ref={invoiceRef}>
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {invoice.company.logoUrl && (
              <img 
                src={invoice.company.logoUrl} 
                alt={`${invoice.company.name} Logo`} 
                className="h-16 max-w-xs object-contain mb-4" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600"># {invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex rounded-md px-3 py-1 text-sm font-semibold mb-2 
              ${invoice.payment.status === 'paid' 
                ? 'bg-green-100 text-green-800' 
                : invoice.payment.status === 'partial' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'}"
            >
              {invoice.payment.status === 'paid' 
                ? 'Paid' 
                : invoice.payment.status === 'partial' 
                ? 'Partially Paid' 
                : 'Unpaid'}
            </div>
            <p className="text-gray-600">
              <span className="font-semibold">Issue Date:</span> {formatDate(invoice.dateIssued)}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Due Date:</span> {formatDate(invoice.dateDue)}
            </p>
          </div>
        </div>

        {/* Company and Client Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-gray-700 font-semibold mb-2">From:</h2>
            <p className="font-semibold">{invoice.company.name}</p>
            <div className="text-gray-600">
              {invoice.company.address && <p>{invoice.company.address}</p>}
              {(invoice.company.city || invoice.company.state || invoice.company.zipCode) && (
                <p>
                  {invoice.company.city}{invoice.company.city && invoice.company.state ? ', ' : ''}
                  {invoice.company.state} {invoice.company.zipCode}
                </p>
              )}
              {invoice.company.country && <p>{invoice.company.country}</p>}
              {invoice.company.email && <p>{invoice.company.email}</p>}
              {invoice.company.phone && <p>{invoice.company.phone}</p>}
            </div>
          </div>
          <div>
            <h2 className="text-gray-700 font-semibold mb-2">Bill To:</h2>
            <p className="font-semibold">{invoice.client.name}</p>
            <div className="text-gray-600">
              {invoice.client.address && <p>{invoice.client.address}</p>}
              {(invoice.client.city || invoice.client.state || invoice.client.zipCode) && (
                <p>
                  {invoice.client.city}{invoice.client.city && invoice.client.state ? ', ' : ''}
                  {invoice.client.state} {invoice.client.zipCode}
                </p>
              )}
              {invoice.client.country && <p>{invoice.client.country}</p>}
              {invoice.client.email && <p>{invoice.client.email}</p>}
              {invoice.client.phone && <p>{invoice.client.phone}</p>}
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Qty
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Unit Price
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">{formatCurrency(item.unitPrice, invoice.payment.currency)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.amount, invoice.payment.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-80">
            <div className="border-t border-gray-200 pt-4 pb-2">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Subtotal:</dt>
                <dd className="text-gray-900 font-medium">{formatCurrency(invoice.payment.subtotal, invoice.payment.currency)}</dd>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <dt className="text-gray-600">Tax ({invoice.payment.taxRate}%):</dt>
                <dd className="text-gray-900 font-medium">{formatCurrency(invoice.payment.taxAmount, invoice.payment.currency)}</dd>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <dt className="text-gray-600">Total:</dt>
                <dd className="text-gray-900 font-medium">{formatCurrency(invoice.payment.total, invoice.payment.currency)}</dd>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <dt className="text-gray-600">Amount Paid:</dt>
                <dd className="text-gray-900 font-medium">{formatCurrency(invoice.payment.amountPaid, invoice.payment.currency)}</dd>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                <dt className="text-base font-bold text-gray-900">Balance Due:</dt>
                <dd className="text-base font-bold text-gray-900">{formatCurrency(invoice.payment.balanceDue, invoice.payment.currency)}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-gray-700 font-semibold mb-2">Notes</h2>
            <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;