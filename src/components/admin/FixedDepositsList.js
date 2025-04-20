import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FixedDepositsList() {
  const [fixedDeposits, setFixedDeposits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFixedDeposits();
  }, []);

  const fetchFixedDeposits = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/fixed-deposits');
      setFixedDeposits(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fixed deposits:', error);
      setError('Failed to load fixed deposits');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading fixed deposits...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h5 className="mb-0">Fixed Deposits</h5>
      </div>
      <div className="card-body">
        {fixedDeposits.length === 0 ? (
          <p className="text-center">No fixed deposits found</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Interest Rate</th>
                  <th>Term (Months)</th>
                  <th>Maturity Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fixedDeposits.map((fd) => (
                  <tr key={fd.id}>
                    <td>{fd.id}</td>
                    <td>{fd.customer?.firstName} {fd.customer?.lastName}</td>
                    <td>{fd.account?.accountNumber}</td>
                    <td>₹{fd.amount.toFixed(2)}</td>
                    <td>{fd.interestRate}%</td>
                    <td>{fd.termMonths}</td>
                    <td>{new Date(fd.maturityDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge bg-${fd.status === 'ACTIVE' ? 'success' : 'secondary'}`}>
                        {fd.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FixedDepositsList; 