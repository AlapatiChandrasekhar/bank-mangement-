import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Add request interceptor to handle token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          localStorage.clear(); // Clear all stored data
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired. Please login again.'));
        case 403:
          return Promise.reject(new Error('You do not have permission to perform this action.'));
        case 404:
          return Promise.reject(new Error('The requested resource was not found.'));
        default:
          return Promise.reject(new Error(error.response.data?.message || 'An error occurred.'));
      }
    }
    return Promise.reject(new Error('Network error. Please check your connection.'));
  }
);

const adminService = {
    createUser: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/admin/users/create`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createAccount: async (accountData) => {
        try {
            const response = await axios.post(`${API_URL}/admin/accounts`, {
                email: accountData.email,
                accountType: accountData.accountType,
                accountNumber: accountData.accountNumber,
                initialBalance: parseFloat(accountData.initialBalance || 0)
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllCustomers: async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/customers`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    makeDeposit: async (accountNumber, amount) => {
        try {
            console.log('Making deposit:', { accountNumber, amount });
            const response = await axios.post(`${API_URL}/accounts/deposit`, {
                accountNumber: accountNumber,
                amount: parseFloat(amount)
            });
            console.log('Deposit response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Deposit error:', error.response?.data || error.message);
            throw error;
        }
    },

    makeTransfer: async (fromAccountNumber, toAccountNumber, amount) => {
        try {
            console.log('Making transfer:', { fromAccountNumber, toAccountNumber, amount });
            const response = await axios.post(`${API_URL}/accounts/transfer`, {
                fromAccountNumber: fromAccountNumber,
                toAccountNumber: toAccountNumber,
                amount: parseFloat(amount)
            });
            console.log('Transfer response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Transfer error:', error.response?.data || error.message);
            throw error;
        }
    },

    getPendingLoans: async () => {
        try {
            console.log('Fetching pending loans...');
            const response = await axios.get(`${API_URL}/loans/pending`);
            console.log('Pending loans response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching pending loans:', error);
            throw error;
        }
    },

    getAllLoans: async (includeRejected = false) => {
        try {
            console.log('Fetching all loans...');
            const response = await axios.get(`${API_URL}/admin/loans/all`, {
                params: { includeRejected }
            });
            console.log('All loans response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching all loans:', error);
            throw error;
        }
    },

    updateLoanStatus: async (loanId, status, remarks = '') => {
        try {
            console.log(`Updating loan ${loanId} status to ${status}`);
            
            // Ensure we're using the correct endpoint based on the action
            const endpoint = status === 'APPROVED' ? 'approve' : 'reject';
            const url = `${API_URL}/admin/loans/${loanId}/${endpoint}`;
            
            console.log(`Making request to: ${url}`);
            const response = await axios.post(url, { remarks });
            
            console.log('Loan status update response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating loan status:', error);
            throw error;
        }
    },

    getAllFixedDeposits: async () => {
        try {
            console.log('Fetching all fixed deposits...');
            const response = await axios.get(`${API_URL}/admin/fixed-deposits`);
            console.log('Fixed deposits response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching fixed deposits:', error);
            throw error;
        }
    },

    getStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/stats`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default adminService; 