import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ViewLoans() {
  const [accountNumber, setAccountNumber] = useState('');
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const userEmail = localStorage.getItem('email');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // First validate if the account belongs to the logged-in user
      const validateResponse = await axios.get(`http://localhost:8080/api/accounts/validate?accountNumber=${accountNumber}&email=${userEmail}`);
      
      if (!validateResponse.data.valid) {
        setError('This account number does not belong to your profile');
        setLoans([]);
        setLoading(false);
        return;
      }

      // If validation passes, fetch the loans
      console.log('Fetching loans for account:', accountNumber);
      const response = await axios.get(`http://localhost:8080/api/loans?accountNumber=${accountNumber}`);
      console.log('Loans response:', response.data);
      setLoans(response.data);
      setSearched(true);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError(err.response?.data?.message || 'Error fetching loans. Please try again.');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning';
      case 'APPROVED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Loans</h2>
        <Link to="/loans/apply" className="btn btn-primary">
          Apply for Loan
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row align-items-end">
              <div className="col-md-8">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter your account number"
                  required
                />
              </div>
              <div className="col-md-4">
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search Loans'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {searched && loans.length === 0 && !error && (
        <div className="alert alert-info">
          No loans found for this account number. Click "Apply for Loan" to get started!
        </div>
      )}

      {loans.length > 0 && (
        <div className="row">
          {loans.map(loan => (
            <div key={loan.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">{loan.loanType} Loan</h5>
                    <span className={`badge ${getStatusBadgeClass(loan.status)}`}>
                      {loan.status}
                    </span>
                  </div>
                  <div className="loan-details">
                    <p><strong>Amount:</strong> ₹{loan.amount.toLocaleString()}</p>
                    <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
                    <p><strong>Term:</strong> {loan.termMonths} months</p>
                    <p><strong>Application Date:</strong> {new Date(loan.applicationDate).toLocaleDateString()}</p>
                    {loan.approvalDate && (
                      <p><strong>Approval Date:</strong> {new Date(loan.approvalDate).toLocaleDateString()}</p>
                    )}
                    {loan.remarks && (
                      <p><strong>Remarks:</strong> {loan.remarks}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewLoans; 