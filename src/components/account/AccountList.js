import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [transactionData, setTransactionData] = useState({
    amount: '',
    toAccountNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await axios.get(`http://localhost:8080/api/accounts?customerId=${user.id}`);
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setError('Failed to fetch accounts');
      }
    };

    fetchAccounts();
  }, []);

  const handleTransaction = async (type, accountNumber) => {
    try {
      setError('');
      setSuccess('');

      if (type === 'transfer' && !transactionData.toAccountNumber) {
        setError('Please enter recipient account number');
        return;
      }

      const amount = parseFloat(transactionData.amount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      switch (type) {
        case 'deposit':
          await axios.post('http://localhost:8080/api/accounts/deposit', {
            accountNumber,
            amount
          });
          break;
        case 'withdraw':
          await axios.post('http://localhost:8080/api/accounts/withdraw', {
            accountNumber,
            amount
          });
          break;
        case 'transfer':
          await axios.post('http://localhost:8080/api/accounts/transfer', {
            fromAccountNumber: accountNumber,
            toAccountNumber: transactionData.toAccountNumber,
            amount
          });
          break;
        default:
          setError('Invalid transaction type');
          return;
      }

      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} successful!`);
      setTransactionData({ amount: '', toAccountNumber: '' });
      // Refresh accounts
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const accountsResponse = await axios.get(`http://localhost:8080/api/accounts?customerId=${user.id}`);
      setAccounts(accountsResponse.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Transaction failed';
      setError(typeof errorMessage === 'string' ? errorMessage : 'An error occurred');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Accounts</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row">
        {accounts.map(account => (
          <div key={account.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{account.accountType} Account</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Account Number: {account.accountNumber}
                </h6>
                <p className="card-text">Balance: ₹{account.balance.toFixed(2)}</p>
                
                <div className="mt-3">
                  <div className="mb-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      value={transactionData.amount}
                      onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                    />
                  </div>
                  
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => handleTransaction('deposit', account.accountNumber)}
                  >
                    Deposit
                  </button>
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => handleTransaction('withdraw', account.accountNumber)}
                  >
                    Withdraw
                  </button>
                  
                  <div className="mt-2">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Recipient Account Number"
                      value={transactionData.toAccountNumber}
                      onChange={(e) => setTransactionData({...transactionData, toAccountNumber: e.target.value})}
                    />
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleTransaction('transfer', account.accountNumber)}
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountList; 