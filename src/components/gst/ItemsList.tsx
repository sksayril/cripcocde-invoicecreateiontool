import React, { useState } from 'react';
import { useGSTInvoice } from '../../contexts/GSTInvoiceContext';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

interface ItemsListProps {
  onNext?: () => void;
}

interface NewItem {
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
}

const defaultNewItem: NewItem = {
  description: '',
  hsnCode: '',
  quantity: 1,
  unit: 'PCS',
  unitPrice: 0,
  cgstPercent: 9,
  sgstPercent: 9,
  igstPercent: 18,
};

const ItemsList: React.FC<ItemsListProps> = ({ onNext }) => {
  const { invoice, addItem, updateItem, removeItem, calculateTotals } = useGSTInvoice();
  const [newItem, setNewItem] = useState<NewItem>(defaultNewItem);
  const [errors, setErrors] = useState<string[]>([]);

  const handleNewItemChange = (field: keyof NewItem, value: string | number) => {
    const updates = { [field]: value };
    
    // If changing CGST/SGST, keep them in sync for regular cases
    if (field === 'cgstPercent' && !invoice.isInterState) {
      updates.sgstPercent = value;
    } else if (field === 'sgstPercent' && !invoice.isInterState) {
      updates.cgstPercent = value;
    }
    
    setNewItem(prev => ({ ...prev, ...updates }));
  };

  const validateItem = (item: NewItem): string[] => {
    const errors: string[] = [];
    if (!item.description) errors.push('Description is required');
    if (!item.hsnCode) errors.push('HSN/SAC Code is required');
    if (item.quantity <= 0) errors.push('Quantity must be greater than 0');
    if (item.unitPrice < 0) errors.push('Unit price cannot be negative');
    
    if (invoice.isInterState) {
      if (item.igstPercent <= 0) errors.push('IGST % is required');
    } else {
      if (item.cgstPercent <= 0) errors.push('CGST % is required');
      if (item.sgstPercent <= 0) errors.push('SGST % is required');
    }
    
    return errors;
  };

  const handleAddItem = () => {
    const validationErrors = validateItem(newItem);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors([]);
    addItem({
      ...newItem,
      taxableValue: newItem.quantity * newItem.unitPrice,
      cgstAmount: invoice.isInterState ? 0 : (newItem.quantity * newItem.unitPrice * newItem.cgstPercent) / 100,
      sgstAmount: invoice.isInterState ? 0 : (newItem.quantity * newItem.unitPrice * newItem.sgstPercent) / 100,
      igstAmount: invoice.isInterState ? (newItem.quantity * newItem.unitPrice * newItem.igstPercent) / 100 : 0,
      amount: newItem.quantity * newItem.unitPrice
    });
    
    setNewItem(defaultNewItem);
    calculateTotals();
  };

  const handleUpdateItem = (id: string, field: string, value: string | number) => {
    const item = invoice.items.find(item => item.id === id);
    if (!item) return;

    const updates: Record<string, any> = { [field]: value };
    
    updateItem(id, updates);
    calculateTotals();
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Items & GST Details</h2>
      <p className="text-sm text-gray-500 mb-6">
        Add items with their HSN codes and applicable GST rates
      </p>

      {errors.length > 0 && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HSN/SAC
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty & Unit
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              {invoice.isInterState ? (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IGST %
                </th>
              ) : (
                <>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CGST %
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SGST %
                  </th>
                </>
              )}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    className="block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.hsnCode}
                    onChange={(e) => handleUpdateItem(item.id, 'hsnCode', e.target.value)}
                    className="block w-32 sm:text-sm border-gray-300 rounded-md"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                      className="block w-20 sm:text-sm border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                      className="block w-16 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                    className="block w-32 sm:text-sm border-gray-300 rounded-md ml-auto"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {formatCurrency(item.taxableValue)}
                </td>
                {invoice.isInterState ? (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <input
                      type="number"
                      value={item.igstPercent}
                      onChange={(e) => handleUpdateItem(item.id, 'igstPercent', Number(e.target.value))}
                      className="block w-20 sm:text-sm border-gray-300 rounded-md ml-auto"
                    />
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <input
                        type="number"
                        value={item.cgstPercent}
                        onChange={(e) => handleUpdateItem(item.id, 'cgstPercent', Number(e.target.value))}
                        className="block w-20 sm:text-sm border-gray-300 rounded-md ml-auto"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <input
                        type="number"
                        value={item.sgstPercent}
                        onChange={(e) => handleUpdateItem(item.id, 'sgstPercent', Number(e.target.value))}
                        className="block w-20 sm:text-sm border-gray-300 rounded-md ml-auto"
                      />
                    </td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  {formatCurrency(item.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Add new item row */}
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={newItem.description}
                  onChange={(e) => handleNewItemChange('description', e.target.value)}
                  placeholder="Item Description"
                  className="block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={newItem.hsnCode}
                  onChange={(e) => handleNewItemChange('hsnCode', e.target.value)}
                  placeholder="HSN/SAC"
                  className="block w-32 sm:text-sm border-gray-300 rounded-md"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => handleNewItemChange('quantity', Number(e.target.value))}
                    placeholder="Qty"
                    className="block w-20 sm:text-sm border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => handleNewItemChange('unit', e.target.value)}
                    placeholder="Unit"
                    className="block w-16 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <input
                  type="number"
                  value={newItem.unitPrice}
                  onChange={(e) => handleNewItemChange('unitPrice', Number(e.target.value))}
                  placeholder="Rate"
                  className="block w-32 sm:text-sm border-gray-300 rounded-md ml-auto"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {formatCurrency(newItem.quantity * newItem.unitPrice)}
              </td>
              {invoice.isInterState ? (
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <input
                    type="number"
                    value={newItem.igstPercent}
                    onChange={(e) => handleNewItemChange('igstPercent', Number(e.target.value))}
                    placeholder="IGST %"
                    className="block w-20 sm:text-sm border-gray-300 rounded-md ml-auto"
                  />
                </td>
              ) : (
                <>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <input
                      type="number"
                      value={newItem.cgstPercent}
                      onChange={(e) => handleNewItemChange('cgstPercent', Number(e.target.value))}
                      placeholder="CGST %"
                      className="block w-20 sm:text-sm border-gray-300 rounded-md ml-auto"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <input
                      type="number"
                      value={newItem.sgstPercent}
                      onChange={(e) => handleNewItemChange('sgstPercent', Number(e.target.value))}
                      placeholder="SGST %"
                      className="block w-20 sm:text-sm border-gray-300 rounded-md ml-auto"
                    />
                  </td>
                </>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                {formatCurrency(
                  newItem.quantity * newItem.unitPrice * 
                  (1 + (invoice.isInterState ? newItem.igstPercent : (newItem.cgstPercent + newItem.sgstPercent)) / 100)
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={handleAddItem}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Taxable Amount</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(invoice.subTotal)}</dd>
          </div>
          {invoice.isInterState ? (
            <div>
              <dt className="text-sm font-medium text-gray-500">IGST Amount</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(invoice.igstTotal)}</dd>
            </div>
          ) : (
            <>
              <div>
                <dt className="text-sm font-medium text-gray-500">CGST Amount</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(invoice.cgstTotal)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">SGST Amount</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(invoice.sgstTotal)}</dd>
              </div>
            </>
          )}
          <div className="sm:col-span-3">
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(invoice.grandTotal)}</dd>
          </div>
        </dl>
      </div>

      {onNext && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onNext}
            disabled={invoice.items.length === 0}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              invoice.items.length > 0
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Next: Payment Details
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
