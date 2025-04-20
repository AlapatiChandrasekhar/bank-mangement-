import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const PendingLoans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const fetchPendingLoans = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingLoans();
      console.log('Fetched pending loans:', data); // Debug log
      setLoans(data || []); // Ensure we always set an array
      setError('');
    } catch (err) {
      console.error('Error fetching pending loans:', err);
      setError(err.message || 'Error fetching pending loans. Please try again.');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoanAction = async (loanId, action, remarks = '') => {
    try {
      await adminService.updateLoanStatus(loanId, action, remarks);
      setSuccess(`Loan ${action.toLowerCase()}ed successfully`);
      setError('');
      // Refresh the loans list
      fetchPendingLoans();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(`Error ${action.toLowerCase()}ing loan:`, err);
      setError(err.message || `Error ${action.toLowerCase()}ing loan`);
      setSuccess('');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering pending loans:', loans); // Debug log

  return (
    <div className="container mt-4">
      <h2>Pending Loans</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Account Number</th>
              <th>Amount</th>
              <th>Interest Rate (%)</th>
              <th>Tenure (Months)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans && loans.length > 0 ? (
              loans.map(loan => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>{loan.account?.accountNumber}</td>
                  <td>₹{loan.amount.toLocaleString()}</td>
                  <td>{loan.interestRate}</td>
                  <td>{loan.termMonths}</td>
                  <td>{loan.status}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleLoanAction(loan.id, 'APPROVED')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => {
                          const remarks = window.prompt('Enter rejection remarks:');
                          if (remarks !== null) {
                            handleLoanAction(loan.id, 'REJECTED', remarks);
                          }
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No pending loans found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingLoans; 