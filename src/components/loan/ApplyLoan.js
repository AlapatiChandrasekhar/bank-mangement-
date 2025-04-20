import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ApplyLoan() {
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: '',
    interestRate: '',
    tenure: '',
    loanType: 'PERSONAL'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting loan application:', formData);
      const response = await axios.post('http://localhost:8080/api/loans', {
        accountNumber: formData.accountNumber,
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        termMonths: parseInt(formData.tenure),
        loanType: formData.loanType,
        status: 'PENDING'
      });
      console.log('Loan application response:', response.data);
      navigate('/loans');
    } catch (err) {
      console.error('Error applying for loan:', err);
      setError(err.response?.data?.message || 'An error occurred while applying for the loan');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4">Apply for Loan</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your account number"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Loan Type</label>
                <select
                  className="form-control"
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleChange}
                  required
                >
                  <option value="PERSONAL">Personal Loan</option>
                  <option value="HOME">Home Loan</option>
                  <option value="VEHICLE">Vehicle Loan</option>
                  <option value="EDUCATION">Education Loan</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Loan Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="1000"
                  step="1000"
                  placeholder="Enter loan amount"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Interest Rate (%)</label>
                <input
                  type="number"
                  className="form-control"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  required
                  min="1"
                  max="20"
                  step="0.1"
                  placeholder="Enter interest rate"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Term (months)</label>
                <input
                  type="number"
                  className="form-control"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                  required
                  min="6"
                  max="60"
                  placeholder="Enter loan term in months"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Apply for Loan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyLoan; 