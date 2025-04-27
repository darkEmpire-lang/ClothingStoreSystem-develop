import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/expenses');
        setExpenses(response.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, []);

  return (
    <div>
      <h2>View All Expenses</h2>
      {loading ? (
        <p>Loading expenses...</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id}>
              <p><strong>Category:</strong> {expense.category}</p>
              <p><strong>Amount:</strong> ${expense.amount}</p>
              <p><strong>Note:</strong> {expense.note || 'No notes'}</p>
              <p><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewExpenses;
