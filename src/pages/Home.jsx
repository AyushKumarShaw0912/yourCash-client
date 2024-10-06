import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TransactionTable from '../components/TransactionTable';
import { toast } from 'react-toastify';
import GetMonthly from '../components/GetMonthly';
import Modal from "../components/Modal"

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const user=JSON.parse(localStorage.getItem("user"))
 

  // Fetch transactions from the API
  const getTransactions = async () => {
    try {
      const res = await axios.get('https://yourcash-api.onrender.com/api/v1/expense', {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setTransactions(res.data.transactions);
    } catch (error) {
      toast.error('Error fetching transactions');
    }
  };

  // Delete a transaction
  const onDelete = async (id) => {
    try {
      const res = await axios.delete(`https://yourcash-api.onrender.com/api/v1/expense/delete/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success('Deleted successfully');
        getTransactions();
      }
    } catch (error) {
      toast.error('Unable to delete');
    }
  };

  // Open modal for adding a new transaction
  const handleAddClick = () => {
    setSelectedTransaction(null); // No selected transaction in add mode
    setModalMode('add');
  };

  // Open modal for editing an existing transaction
  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalMode('edit');
  };

  // Handle saving transaction (add/update)
  // const handleSave = async (transaction) => {
  //   try {
  //     if (modalMode === 'edit') {
  //       // Update existing transaction
  //       await axios.put(`/api/v1/expense/update/${transaction._id}`, transaction, {
  //         headers: { 'Content-Type': 'application/json' },
  //         withCredentials: true,
  //       });
  //       toast.success('Transaction updated successfully');
  //     } else {
  //       // Add new transaction
  //       await axios.post('/api/v1/expense', transaction, {
  //         headers: { 'Content-Type': 'application/json' },
  //         withCredentials: true,
  //       });
  //       toast.success('Transaction added successfully');
  //     }
      
  //     // Reset modal state
  //     setSelectedTransaction(null);
  //     setModalMode('add');
  //     getTransactions(); // Refresh transaction list after add/update
  //   } catch (error) {
  //     toast.error('Error submitting transaction: ' + error.message);
  //   }
  // };

  // Calculate total income and expenditure
  const totalIncome = transactions
    .filter(transaction => transaction.type === 'Income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenditure = transactions
    .filter(transaction => transaction.type === 'Expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpenditure;

  useEffect(() => {
    getTransactions(); // Fetch transactions when the component mounts
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 pt-16">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome {user?.username}</h2>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-gray-600">Total Income</p>
            <p className="text-xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-gray-600">Total Expenditure</p>
            <p className="text-xl font-bold text-red-600">₹{totalExpenditure.toFixed(2)}</p>
          </div>
          <div className={`p-4 rounded-lg ${balance >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
            <p className="text-gray-600">Current Balance</p>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>₹{balance.toFixed(2)}</p>
          </div>
        </div>
        <GetMonthly transactions={transactions} />
        </div> 
        <Modal
        transaction={selectedTransaction}
        mode={modalMode}
        // onSave={handleSave}
        onClose={() => setSelectedTransaction(null)}
      />

      <TransactionTable
        transactions={transactions}
        onDelete={onDelete}
        onEdit={handleEditClick}
      />

     

    
      
     
    </div>
  );
};

export default Home;
