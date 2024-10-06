import React, { useState, useEffect } from 'react';

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    paymentType: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when items per page change
  };

  // Sorting function
  const sortTransactions = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredTransactions].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(sortedData);
  };

  // Filtering function
  const filterTransactions = () => {
    let filteredData = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.Date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (filters.type === '' || transaction.type === filters.type) &&
        (filters.category === '' || transaction.category === filters.category) &&
        (filters.paymentType=== '' || transaction.paymentType === filters.paymentType) &&
        // (filters.minAmount === '' || transaction.amount >= parseFloat(filters.minAmount)) &&
        // (filters.maxAmount === '' || transaction.amount <= parseFloat(filters.maxAmount)) &&
        (filters.description === '' || transaction.description.toLowerCase().includes(filters.description.toLowerCase())) &&
        (!startDate || transactionDate >= startDate) &&
        (!endDate || transactionDate <= endDate)
      );
    });
    setFilteredTransactions(filteredData);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    filterTransactions();
  }, [filters, transactions]);

  // Get current transactions for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="max-w-full mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Transaction Table</h2>

      {/* Filter Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Housing">Housing</option>
          <option value="Education">Education</option>
          <option value="Taxes">Taxes</option>
          <option value="Utilities">Utilitie</option>
          <option value="Shopping">Shopping</option>
          <option value="Savings">Savings</option>
          
        </select>

        {/* Payment Method Filter */}
        <select
          name="paymentType"
          value={filters.paymentType}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Payment Methods</option>
          <option value="Card">Credit Card/Debit Card</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Cheque">Cheque</option>
          <option value="Bank transfer">Bank Transfer</option>
        </select>

        {/* Search by Description */}
        <input
          type="text"
          name="description"
          value={filters.description}
          onChange={handleFilterChange}
          placeholder="Search by Description"
          className="border p-2 rounded"
        />
         <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2 rounded w-full"
        />
         <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2 rounded w-full"
        />
      </div>

    

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                onClick={() => sortTransactions('Date')}
                className="cursor-pointer p-3 border-b  text-left font-semibold text-gray-600"
              >
                Date {sortConfig.key === 'Date' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => sortTransactions('amount')}
                className="cursor-pointer p-3 border-b  text-left font-semibold text-gray-600"
              >
                Amount {sortConfig.key === 'amount' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => sortTransactions('category')}
                className="cursor-pointer p-3 border-b  text-left font-semibold text-gray-600"
              >
                Category {sortConfig.key === 'category' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => sortTransactions('subcategory')}
                className="cursor-pointer p-3 border-b  text-left font-semibold text-gray-600"
              >
                Subcategory {sortConfig.key === 'subcategory' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => sortTransactions('type')}
                className="cursor-pointer p-3 border-b  text-left font-semibold text-gray-600"
              >
                Type {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => sortTransactions('paymentType')}
                className="cursor-pointer p-3 border-b  text-left font-semibold text-gray-600"
              >
                PaymentType {sortConfig.key === 'paymentType' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th className="cursor-pointer p-3 border-b  text-left font-semibold text-gray-600">Description</th>
              <th className="cursor-pointer p-3 border-b  text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="px-4 py-3 text-sm text-gray-600">{new Date(transaction.Date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-gray-800">
                {transaction.type === 'Income' ? (
                  <span className="text-green-600">+₹{transaction.amount.toFixed(2)}</span>
                ) : (
                  <span className="text-red-600">-₹{Math.abs(transaction.amount).toFixed(2)}</span>
                )}
              </td>
                <td className="px-4 py-3 text-sm text-gray-600">{transaction.category}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{transaction.subcategory || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{transaction.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{transaction.paymentType || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{transaction.description}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(transaction._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`p-2 bg-gray-300 rounded ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="mb-4">
        <label htmlFor="itemsPerPage" className="mr-2">Entries per page:</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border p-2 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`p-2 bg-gray-300 rounded ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
