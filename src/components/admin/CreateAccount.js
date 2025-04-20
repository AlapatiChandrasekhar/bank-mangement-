import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.userEmail || '',
    accountType: 'SAVINGS',
    accountNumber: '',
    initialBalance: '0'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateAccountNumber();
  }, []);

  const generateAccountNumber = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/admin/generate-account-number', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFormData(prev => ({
        ...prev,
        accountNumber: response.data.accountNumber
      }));
    } catch (err) {
      setError('Error generating account number');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8080/api/admin/accounts/create',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSuccess('Account created successfully!');
      setError('');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">User Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <small className="text-muted">Enter the email of the registered user</small>
            </div>

            <div className="mb-3">
              <label htmlFor="accountType" className="form-label">Account Type</label>
              <select
                className="form-select"
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
              >
                <option value="SAVINGS">Savings</option>
                <option value="CHECKING">Checking</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="accountNumber" className="form-label">Account Number</label>
              <input
                type="text"
                className="form-control"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                readOnly
              />
              <small className="text-muted">Auto-generated account number</small>
            </div>

            <div className="mb-3">
              <label htmlFor="initialBalance" className="form-label">Initial Balance (₹)</label>
              <input
                type="number"
                className="form-control"
                id="initialBalance"
                name="initialBalance"
                value={formData.initialBalance}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount; 