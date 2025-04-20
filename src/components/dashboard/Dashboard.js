import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome!</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Account Management</h5>
              <Link to="/accounts" className="btn btn-primary w-100 mb-2">
                View Accounts
              </Link>
              <Link to="/accounts/create" className="btn btn-success w-100">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Fixed Deposits</h5>
              <Link to="/fixed-deposits" className="btn btn-primary w-100 mb-2">
                View Fixed Deposits
              </Link>
              <Link to="/fixed-deposits/create" className="btn btn-success w-100">
                Create Fixed Deposit
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Loans</h5>
              <Link to="/loans" className="btn btn-primary w-100 mb-2">
                View Loans
              </Link>
              <Link to="/loans/apply" className="btn btn-success w-100">
                Apply for Loan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 