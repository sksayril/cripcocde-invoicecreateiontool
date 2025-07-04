import React, { useState } from 'react';
import { useInvoice } from '../../contexts/InvoiceContext';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const ItemsForm: React.FC = () => {
  const { invoice, addItem, updateItem, removeItem, calculateTotals } = useInvoice();
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0,
    amount: 0,
  });

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedItem = { ...newItem, [name]: value };
    
    // Auto calculate amount
    if (name === 'quantity' || name === 'unitPrice') {
      const quantity = name === 'quantity' ? parseFloat(value) || 0 : newItem.quantity;
      const unitPrice = name === 'unitPrice' ? parseFloat(value) || 0 : newItem.unitPrice;
      updatedItem.amount = quantity * unitPrice;
    }
    
    setNewItem(updatedItem);
  };

  const handleAddItem = () => {
    if (newItem.description && newItem.quantity > 0) {
      addItem(newItem);
      setNewItem({
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      });
    }
  };

  const handleUpdateItem = (id: string, field: string, value: string | number) => {
    const item = invoice.items.find(item => item.id === id);
    if (!item) return;

    const updates: Record<string, string | number> = { [field]: value };
    
    // Auto calculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : item.quantity;
      const unitPrice = field === 'unitPrice' ? Number(value) : item.unitPrice;
      updates.amount = quantity * unitPrice;
    }
    
    updateItem(id, updates);
    calculateTotals();
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h2>
      <p className="text-sm text-gray-500 mb-6">
        Add the products or services you're billing for.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Qty
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Unit Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                    className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                    className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {formatCurrency(item.amount, invoice.payment.currency)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
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
              <td className="px-6 py-4">
                <input
                  type="text"
                  name="description"
                  value={newItem.description}
                  onChange={handleNewItemChange}
                  placeholder="Description"
                  className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={newItem.quantity}
                  onChange={handleNewItemChange}
                  placeholder="Qty"
                  className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  name="unitPrice"
                  min="0"
                  step="0.01"
                  value={newItem.unitPrice}
                  onChange={handleNewItemChange}
                  placeholder="Price"
                  className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                {formatCurrency(newItem.amount, invoice.payment.currency)}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button
                  onClick={handleAddItem}
                  className="text-blue-600 hover:text-blue-900"
                  disabled={!newItem.description || newItem.quantity <= 0}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <dl className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <dt>Subtotal:</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(invoice.payment.subtotal, invoice.payment.currency)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ItemsForm;