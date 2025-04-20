import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LoanList() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/loans?userId=${userId}`);
        setLoans(response.data);
      } catch (error) {
        setError('Error fetching loans');
      }
    };

    if (userId) {
      fetchLoans();
    }
  }, [userId]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Loans</h2>
        <Link to="/loans/apply" className="btn btn-primary">
          Apply for Loan
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {loans.map(loan => (
          <div key={loan.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Loan #{loan.id}</h5>
                <p className="card-text">Amount: ₹{loan.amount.toFixed(2)}</p>
                <p className="card-text">Interest Rate: {loan.interestRate}%</p>
                <p className="card-text">Tenure: {loan.tenure} months</p>
                <p className="card-text">
                  <span className={`badge ${
                    loan.status === 'APPROVED' 
                      ? 'bg-success' 
                      : loan.status === 'PENDING' 
                      ? 'bg-warning' 
                      : 'bg-danger'
                  }`}>
                    {loan.status}
                  </span>
                </p>
                {loan.remarks && (
                  <p className="card-text">Remarks: {loan.remarks}</p>
                )}
                <p className="card-text">
                  Application Date: {new Date(loan.applicationDate).toLocaleDateString()}
                </p>
                {loan.approvalDate && (
                  <p className="card-text">
                    Approval Date: {new Date(loan.approvalDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {loans.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info">
              No loans found. Apply for a loan to get started!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanList; 