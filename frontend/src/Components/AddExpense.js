import React, { useState } from 'react';
import axios from 'axios';

const AddExpense = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category || !amount) {
      setError("Category and Amount are required!");
      return;
    }

    try {
      const expenseData = {
        
        category,
        amount,
        note,
      };

      const response = await axios.post("http://localhost:4058/api/expenses/add", expenseData);
      setMessage("Expense added successfully!");
      setCategory('');
      setAmount('');
      setNote('');
      setError('');
    } catch (err) {
      setError('Failed to add expense. Try again!');
    }
  };

  return (
    <div>
      <h2>Add New Expense</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
