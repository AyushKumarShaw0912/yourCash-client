import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Example({ transaction = null, mode = 'add',}) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
   
  };
  const handleShow = () => setShow(true);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    subcategory: '',
    paymentType: '',
    type: 'Expense',
    date: '',
    description: '',
  });

  // Fetch categories and subcategories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(
          'https://yourcash-api.onrender.com/api/v1/category',
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        setCategories(categoryResponse.data.categories);
      } catch (error) {
        toast.error(`Error fetching data: ${error.message}`);
      }
    };
    fetchData();
  }, []);

  // Prepopulate the form data if editing a transaction
  useEffect(() => {
    if (transaction && mode === 'edit') {
      setFormData({
        amount: transaction.amount,
        category: transaction.category,
        subcategory: transaction.subcategory,
        paymentType: transaction.paymentType,
        type: transaction.type,
        date: transaction.Date.split('T')[0],  // Format date for the input
        description: transaction.description,
      });

      // Automatically populate subcategories for the selected category
      const selectedCatObj = categories.find((cat) => cat.name === transaction.category);
      setSubcategories(selectedCatObj ? selectedCatObj.subcategories : []);
    }
  }, [transaction, mode, categories]);

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({ ...formData, category: selectedCategory, subcategory: '' });

    // Find subcategories for the selected category
    const selectedCatObj = categories.find((cat) => cat.name === selectedCategory);
    setSubcategories(selectedCatObj ? selectedCatObj.subcategories : []);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior

    try {
      if (mode === 'add') {
        // Add transaction
        await axios.post(
          'https://yourcash-api.onrender.com/api/v1/expense',
          formData,
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        toast.success('Transaction added successfully');
      } else if (mode === 'edit') {
        // Update transaction
        await axios.put(
          `https://yourcash-api.onrender.com/api/v1/expense/update/${transaction._id}`,
          formData,
           { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        toast.success('Transaction updated successfully');
      }

      // Reset the form after submission
      setFormData({
        amount: '',
        category: '',
        subcategory: '',
        paymentType: '',
        type: 'Expense',
        date: '',
        description: '',
      });

      handleClose(); // Close the modal after submission
//onSave(); // Trigger the parent function to refresh data
window.location.reload();
    } catch (error) {
      toast.error(`Error submitting transaction: ${error.message}`);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} >
        {mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
      </Button>

      <Modal show={mode=='edit'||show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {/* Amount */}
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div className="mb-4">
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategory</label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                disabled={!formData.category}
              >
                <option value="">Select a Subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>{subcategory}</option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                id="paymentType"
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a Payment Method</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
                <option value="Upi">Upi</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Type (Expense/Income) */}
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>

            {/* Date */}
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
            >
              {mode === 'edit' ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
}

export default Example;
