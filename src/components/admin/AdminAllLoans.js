import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminAllLoans() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllLoans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/loans');
        setLoans(response.data);
      } catch (err) {
        setError('Failed to fetch loans');
      }
    };

    fetchAllLoans();
  }, []);

  const getBadgeClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning';
      case 'REJECTED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Loans</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loans.length === 0 ? (
        <div className="alert alert-info">No loans found</div>
      ) : (
        <div className="row">
          {loans.map(loan => (
            <div key={loan.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Loan #{loan.id}</h5>
                  <p className="card-text">User ID: {loan.userId}</p>
                  <p className="card-text">Amount: ₹{loan.amount.toFixed(2)}</p>
                  <p className="card-text">Interest Rate: {loan.interestRate}%</p>
                  <p className="card-text">Tenure: {loan.tenure} months</p>
                  <p className="card-text">
                    Status: <span className={`badge ${getBadgeClass(loan.status)}`}>{loan.status}</span>
                  </p>
                  <p className="card-text">
                    Application Date: {new Date(loan.applicationDate).toLocaleDateString()}
                  </p>
                  {loan.approvalDate && (
                    <p className="card-text">
                      Approval Date: {new Date(loan.approvalDate).toLocaleDateString()}
                    </p>
                  )}
                  {loan.remarks && (
                    <p className="card-text">Remarks: {loan.remarks}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminAllLoans; 