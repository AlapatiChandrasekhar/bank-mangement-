import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/transactions/user/${userId}`);
        setTransactions(response.data);
      } catch (err) {
        setError('Failed to fetch transaction history');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getTransactionTypeClass = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-success';
      case 'WITHDRAWAL':
        return 'text-danger';
      case 'TRANSFER_IN':
        return 'text-success';
      case 'TRANSFER_OUT':
        return 'text-danger';
      default:
        return '';
    }
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);

    return ['WITHDRAWAL', 'TRANSFER_OUT'].includes(type) 
      ? `- ${formattedAmount}` 
      : `+ ${formattedAmount}`;
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <div className="alert alert-info">No transactions found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Account Number</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.timestamp)}</td>
                  <td className={getTransactionTypeClass(transaction.type)}>
                    {transaction.type}
                  </td>
                  <td>{transaction.accountNumber}</td>
                  <td>{transaction.description}</td>
                  <td className={getTransactionTypeClass(transaction.type)}>
                    {formatAmount(transaction.amount, transaction.type)}
                  </td>
                  <td>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR'
                    }).format(transaction.balanceAfter)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory; 