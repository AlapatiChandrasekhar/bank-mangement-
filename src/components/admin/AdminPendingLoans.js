import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminPendingLoans() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const fetchPendingLoans = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/loans/pending');
      setLoans(response.data);
    } catch (err) {
      setError('Failed to fetch pending loans');
    }
  };

  const handleAction = async (loanId, action, remarks = '') => {
    try {
      await axios.post(`http://localhost:8080/api/loans/${loanId}/${action}`, { remarks });
      setSuccess(`Loan ${action} successfully`);
      fetchPendingLoans(); // Refresh the list
    } catch (err) {
      setError(err.response?.data || `Failed to ${action} loan`);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pending Loan Applications</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loans.length === 0 ? (
        <div className="alert alert-info">No pending loan applications</div>
      ) : (
        <div className="row">
          {loans.map(loan => (
            <div key={loan.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Loan Application #{loan.id}</h5>
                  <p className="card-text">Amount: ₹{loan.amount.toFixed(2)}</p>
                  <p className="card-text">Interest Rate: {loan.interestRate}%</p>
                  <p className="card-text">Tenure: {loan.tenure} months</p>
                  <p className="card-text">
                    Application Date: {new Date(loan.applicationDate).toLocaleDateString()}
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success flex-grow-1"
                      onClick={() => handleAction(loan.id, 'approve', 'Approved by admin')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger flex-grow-1"
                      onClick={() => handleAction(loan.id, 'reject', 'Rejected by admin')}
                    >
                      Reject
                    </button>
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

export default AdminPendingLoans; 