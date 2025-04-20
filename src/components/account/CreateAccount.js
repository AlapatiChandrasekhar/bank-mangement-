import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateAccount() {
  const [formData, setFormData] = useState({
    accountType: 'SAVINGS',
    accountNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const customerId = localStorage.getItem('userId');
    if (!customerId) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const customerId = localStorage.getItem('userId');
    if (!customerId) {
      setError('Please login to continue');
      setLoading(false);
      return;
    }

    try {
      // Validate account number format
      if (!/^\d{10}$/.test(formData.accountNumber)) {
        setError('Account number must be exactly 10 digits');
        setLoading(false);
        return;
      }

      // Check if account exists and belongs to this customer
      const response = await axios.post('http://localhost:8080/api/accounts', {
        accountType: formData.accountType,
        accountNumber: formData.accountNumber,
        customerId: parseInt(customerId, 10) // Convert to number
      });

      if (response.data) {
        setSuccess('Account verified successfully! Redirecting to accounts page...');
        setTimeout(() => navigate('/accounts'), 2000);
      }
    } catch (err) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to verify account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Link Your Account</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Account Type</label>
              <select
                name="accountType"
                className="form-select"
                value={formData.accountType}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="SAVINGS">Savings</option>
                <option value="CHECKING">Checking</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                className="form-control"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit account number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
                disabled={loading}
              />
              <div className="form-text">
                Please enter the 10-digit account number provided by the admin.
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Link Account'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/accounts')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount; 