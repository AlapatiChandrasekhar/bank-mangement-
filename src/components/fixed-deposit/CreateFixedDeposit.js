import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateFixedDeposit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: '',
    tenure: '',
    interestRate: '6.5' // Default interest rate
  });
  const [error, setError] = useState('');
  const [accountBalance, setAccountBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchAccountBalance = async (accountNumber) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/accounts/${accountNumber}`);
      setAccountBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching account balance:', error);
      setError('Failed to fetch account balance');
    }
  };

  const handleAccountNumberChange = (e) => {
    const accountNumber = e.target.value;
    setFormData(prev => ({ ...prev, accountNumber }));
    if (accountNumber) {
      fetchAccountBalance(accountNumber);
    } else {
      setAccountBalance(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const tenure = parseInt(formData.tenure);
      const interestRate = parseFloat(formData.interestRate);

      if (!formData.accountNumber) {
        setError('Please enter your account number');
        return;
      }

      if (accountBalance === null) {
        setError('Please enter a valid account number');
        return;
      }

      if (amount > accountBalance) {
        setError(`Insufficient balance. Available balance: ₹${accountBalance}`);
        return;
      }

      const response = await axios.post('http://localhost:8080/api/fixed-deposits', {
        accountNumber: formData.accountNumber,
        amount: amount,
        tenure: tenure,
        interestRate: interestRate
      });
      
      console.log('Fixed deposit created:', response.data);
      alert(`Fixed deposit created successfully! Remaining balance: ₹${response.data.remainingBalance}`);
      navigate('/fixed-deposits');
    } catch (error) {
      console.error('Error creating fixed deposit:', error);
      setError(error.response?.data?.message || 'Failed to create fixed deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Create Fixed Deposit</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {accountBalance !== null && (
                <div className="alert alert-info" role="alert">
                  Available Balance: ₹{accountBalance}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="accountNumber" className="form-label">Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleAccountNumberChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="1000"
                    required
                  />
                  <div className="form-text">Minimum amount: ₹1,000</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="tenure" className="form-label">Tenure (months)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="tenure"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleChange}
                    min="6"
                    max="120"
                    required
                  />
                  <div className="form-text">Tenure should be between 6 and 120 months</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="interestRate" className="form-label">Interest Rate (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="interestRate"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    step="0.1"
                    readOnly
                  />
                  <div className="form-text">Fixed interest rate: 6.5%</div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Fixed Deposit'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/fixed-deposits')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateFixedDeposit; 