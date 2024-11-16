'use client';

import React, { useEffect, useState } from 'react';
import {getOrder} from '@/app/backOrder'
import axios from 'axios';

interface Order {
  order_id: number;
  customer_id: number;
  product_name: string;
  quantity: number;
  price: number;
  order_status: string;
}

const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer_id: '',
    product_name: '',
    quantity: '',
    price: '',
    order_status: ''
  });
  const [searchId, setSearchId] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrder();
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async () => {
    try {
      await axios.post('http://localhost:8080/orders/add', newOrder);
      setShowAddForm(false);
      setNewOrder({ customer_id: '', product_name: '', quantity: '', price: '', order_status: '' });
      fetchAllOrders();
    } catch (err) {
      console.error('Error adding order:', err);
      setError('Failed to add order');
    }
  };

  const handleSearchOrder = async () => {
    if (!searchId) return;
    setLoading(true);
    setIsSearching(true);
    try {
      const response = await axios.get(`http://localhost:8080/orders/${searchId}`);
      setOrders([response.data]); // Display only the searched order
    } catch (err) {
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setIsSearching(false);
    setSearchId('');
    fetchAllOrders();
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const startIndex = (currentPage - 1) * itemsPerPage;
   const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);
  // const currentOrders = Array.isArray(orders) ? orders.slice(startIndex, startIndex + itemsPerPage) : [];


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-white rounded shadow-lg mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
          <button
            onClick={handleSearchOrder}
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
          Add Order
        </button>
      </div>

      <table className="min-w-full bg-white border rounded-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Customer ID</th>
            <th className="px-4 py-2 text-left">Product Name</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.order_id} className="border-b">
              <td className="px-4 py-2">{order.order_id}</td>
              <td className="px-4 py-2">{order.customer_id}</td>
              <td className="px-4 py-2">{order.product_name}</td>
              <td className="px-4 py-2">{order.quantity}</td>
              <td className="px-4 py-2">${order.price}</td>
              <td className="px-4 py-2">{order.order_status}</td>
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
          {[...Array(Math.ceil(orders.length / itemsPerPage))].map((_, i) => (
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
            disabled={currentPage === Math.ceil(orders.length / itemsPerPage)}
            className="px-3 py-1 border rounded-r disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}

      {/* Add Order Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">Add New Order</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer ID"
                value={newOrder.customer_id}
                onChange={(e) => setNewOrder({ ...newOrder, customer_id: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Product Name"
                value={newOrder.product_name}
                onChange={(e) => setNewOrder({ ...newOrder, product_name: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newOrder.quantity}
                onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={newOrder.price}
                onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Status"
                value={newOrder.order_status}
                onChange={(e) => setNewOrder({ ...newOrder, order_status: e.target.value })}
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
                onClick={handleAddOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
