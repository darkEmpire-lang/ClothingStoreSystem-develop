import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MonthlyTotal = () => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyTotal = async () => {
      try {
        const month = new Date().getMonth(); // Get current month (0-11)
        const response = await axios.get(`http://localhost:5005/api/expenses/monthly-total/${month}`);
        setTotal(response.data.total);
      } catch (err) {
        console.error('Error fetching monthly total:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyTotal();
  }, []);

  return (
    <div>
      <h2>Monthly Total Expense</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p><strong>Total: ${total}</strong></p>
      )}
    </div>
  );
};

export default MonthlyTotal;
