import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import AccountList from './components/account/AccountList';
import CreateAccount from './components/account/CreateAccount';
import ViewLoans from './components/loan/ViewLoans';
import ApplyLoan from './components/loan/ApplyLoan';
import FixedDepositList from './components/fixed-deposit/FixedDepositList';
import CreateFixedDeposit from './components/fixed-deposit/CreateFixedDeposit';
import TransactionHistory from './components/transaction/TransactionHistory';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import DepositWithdraw from './components/admin/DepositWithdraw';
import PendingLoans from './components/admin/PendingLoans';
import AllLoans from './components/admin/AllLoans';
import UsersList from './components/admin/UsersList';
import CreateUser from './components/admin/CreateUser';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<AccountList />} />
            <Route path="/accounts/create" element={<CreateAccount />} />
            <Route path="/loans" element={<ViewLoans />} />
            <Route path="/loans/apply" element={<ApplyLoan />} />
            <Route path="/fixed-deposits" element={<FixedDepositList />} />
            <Route path="/fixed-deposits/create" element={<CreateFixedDeposit />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/create-account" element={<PrivateRoute><CreateAccount /></PrivateRoute>} />
            <Route path="/admin/deposit" element={<PrivateRoute><DepositWithdraw /></PrivateRoute>} />
            <Route path="/admin/pending-loans" element={<PrivateRoute><PendingLoans /></PrivateRoute>} />
            <Route path="/admin/all-loans" element={<PrivateRoute><AllLoans /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute><UsersList /></PrivateRoute>} />
            <Route path="/admin/create-user" element={<PrivateRoute><CreateUser /></PrivateRoute>} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
