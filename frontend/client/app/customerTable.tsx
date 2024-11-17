'use client'
import React, { useEffect, useState } from 'react';
import { getCustomers } from '@/app/back';
import axios from 'axios';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CustomerTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [searchId, setSearchId] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const fetchAllCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.log(err)
      setError('Failed to fetch customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    try {
      await axios.post('http://localhost:8080/add', newCustomer);
      setShowAddForm(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '' }); // Reset form fields
      fetchAllCustomers(); // Refresh the table to show updated results
    } catch (err) {
      console.error('Error adding customer:', err);
      setError('Failed to add customer');
    }
  };

  const handleSearchCustomer = async () => {
    if (!searchId) return;
    setLoading(true);
    setIsSearching(true);
    try {
      const response = await axios.get(`http://localhost:8080/${searchId}`);
      setCustomers([response.data]); // Display only the searched customer
    } catch (err) {
      console.error('Customer not found:', err);
      setError('Customer not found');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setIsSearching(false);
    setSearchId('');
    fetchAllCustomers(); // Reset to show all customers
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Customer ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
          <button
            onClick={handleSearchCustomer}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Search
          </button>
          {isSearching && (
            <button
              onClick={handleResetSearch}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Reset
            </button>
          )}
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
        >
          Add Customer
        </button>
      </div>

      <table className="min-w-full bg-white border rounded-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Address</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer.id} className="border-b">
              <td className="px-4 py-2">{customer.id}</td>
              <td className="px-4 py-2">{customer.name}</td>
              <td className="px-4 py-2">{customer.email}</td>
              <td className="px-4 py-2">{customer.phone}</td>
              <td className="px-4 py-2">{customer.address}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {!isSearching && (
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-l disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(Math.ceil(customers.length / itemsPerPage))].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border ${i + 1 === currentPage ? 'bg-blue-500 text-white' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(customers.length / itemsPerPage)}
            className="px-3 py-1 border rounded-r disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}

      {/* Add Customer Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Add New Customer</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border rounded text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default CustomerTable;
