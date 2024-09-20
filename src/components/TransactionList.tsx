import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  date: string;
  label: string;
  custom: string | null;
  amount: number;
  tags: { tag: Tag }[];
}

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingLabelId, setEditingLabelId] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>('');
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchTags();
  }, []);

  const fetchTransactions = async () => {
    const response = await axios.get('http://localhost:3001/transactions');
    setTransactions(response.data);
  };

  const fetchTags = async () => {
    const response = await axios.get('http://localhost:3001/tags');
    setTags(response.data);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:3001/transactions/${id}`);
    fetchTransactions();
  };

  const handleUpdate = async (transaction: Transaction) => {
    await axios.put(`http://localhost:3001/transactions/${transaction.id}`, transaction);
    fetchTransactions();
    setEditingId(null);
  };

  const handleUpdateCustomLabel = async (transaction: Transaction, customLabel: string) => {
    try {
      // Create an updated transaction object
      const updatedTransaction = {
        ...transaction,
        custom: customLabel
      };
      
      // Send the full updated transaction object
      await axios.put(`http://localhost:3001/transactions/${transaction.id}`, updatedTransaction);
      
      // Update the local state
      setTransactions(transactions.map(t => 
        t.id === transaction.id ? { ...t, custom: customLabel } : t
      ));
      
      setEditingLabelId(null);
      setEditingLabel('');
    } catch (error) {
      console.error("Error updating custom label:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleEditLabel = (transaction: Transaction) => {
    setEditingLabelId(transaction.id);
    setEditingLabel(transaction.custom || transaction.label);
  };

  const handleSaveLabel = async (transaction: Transaction) => {
    await handleUpdateCustomLabel(transaction, editingLabel);
    setEditingLabelId(null);
  };

  const handleCancelLabelEdit = () => {
    setEditingLabelId(null);
    setEditingLabel('');
  };

  const handleAddTag = async () => {
    if (newTagName.trim()) {
      await axios.post('http://localhost:3001/tags', { name: newTagName });
      setNewTagName('');
      fetchTags();
    }
  };

  const handleAssignTag = async (transactionId: number, tagId: number) => {
    const transaction = transactions.find(t => t.id === transactionId);
    const tag = tags.find(t => t.id === tagId);
    if (transaction && tag) {
      const tagExists = transaction.tags.some(t => t.tag.id === tagId);
      if (!tagExists) {
        const updatedTransaction = {
          ...transaction,
          tags: [...transaction.tags, { tag }]
        };
        await handleUpdate(updatedTransaction);
      }
    }
  };

  const handleRemoveTag = async (transactionId: number, tagId: number) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      const updatedTransaction = {
        ...transaction,
        tags: transaction.tags.filter(t => t.tag.id !== tagId)
      };
      await handleUpdate(updatedTransaction);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="form-input rounded-l-md shadow-sm mt-1 block w-full outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-xl px-2"
            placeholder="New tag name"
          />
          <button
            onClick={handleAddTag}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
          >
            Add Tag
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === transaction.id ? (
                    <input 
                      type="date" 
                      value={transaction.date.split('T')[0]} 
                      onChange={(e) => setTransactions(transactions.map(t => t.id === transaction.id ? {...t, date: e.target.value} : t))}
                      className="form-input rounded-md shadow-sm mt-1 block w-full outline-none"
                    />
                  ) : (
                    new Date(transaction.date).toLocaleDateString()
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingLabelId === transaction.id ? (
                    <div className="flex items-center">
                      <input 
                        type="text" 
                        value={editingLabel}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        className="form-input rounded-md shadow-sm mt-1 block w-full outline-none mr-2"
                      />
                      <button 
                        onClick={() => handleSaveLabel(transaction)} 
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        <CheckIcon size={16} />
                      </button>
                      <button 
                        onClick={handleCancelLabelEdit} 
                        className="text-red-600 hover:text-red-900"
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2">{transaction.custom || transaction.label}</span>
                      <button 
                        onClick={() => handleEditLabel(transaction)} 
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <PencilIcon size={16} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === transaction.id ? (
                    <input 
                      type="number" 
                      value={transaction.amount} 
                      onChange={(e) => setTransactions(transactions.map(t => t.id === transaction.id ? {...t, amount: parseFloat(e.target.value)} : t))}
                      className="form-input rounded-md shadow-sm mt-1 block w-full outline-none"
                    />
                  ) : (
                    `$${transaction.amount.toFixed(2)}`
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {transaction.tags.map((tag) => (
                      <span key={tag.tag.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tag.tag.name}
                        <button onClick={() => handleRemoveTag(transaction.id, tag.tag.id)} className="ml-1 text-blue-600 hover:text-blue-900">×</button>
                      </span>
                    ))}
                    <select
                      onChange={(e) => handleAssignTag(transaction.id, parseInt(e.target.value))}
                      className="form-select block w-full mt-1"
                    >
                      <option value="">Assign a tag</option>
                      {tags.filter(tag => !transaction.tags.some(t => t.tag.id === tag.id)).map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === transaction.id ? (
                    <button onClick={() => handleUpdate(transaction)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                      Save
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(transaction.id)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleDelete(transaction.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;