import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FixedDepositList() {
  const [fixedDeposits, setFixedDeposits] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');

  const fetchFixedDeposits = async (accNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/fixed-deposits/account/${accNumber}`
      );
      console.log('Fixed deposits response:', response.data);
      setFixedDeposits(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching fixed deposits:', error);
      setError('Error fetching fixed deposits. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountNumber) {
      fetchFixedDeposits(accountNumber);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Fixed Deposits</h2>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Enter Account Number:</label>
              <input
                type="text"
                className="form-control"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              Search Fixed Deposits
            </button>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {fixedDeposits.map(fd => (
          <div key={fd.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Fixed Deposit #{fd.id}</h5>
                <p>Amount: ₹{fd.amount}</p>
                <p>Interest Rate: {fd.interestRate}%</p>
                <p>Term: {fd.termMonths} months</p>
                <p>Status: {fd.status}</p>
                <p>Maturity Date: {fd.maturityDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {fixedDeposits.length === 0 && !error && (
        <div className="alert alert-info">
          No fixed deposits found for this account number.
        </div>
      )}
    </div>
  );
}

export default FixedDepositList; 