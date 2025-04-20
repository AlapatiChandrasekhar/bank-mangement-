import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import FixedDepositsList from './FixedDepositsList';

const AdminDashboard = () => {
  const navigate = useNavigate();
  // State variables
  const [customers, setCustomers] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  const [fixedDeposits, setFixedDeposits] = useState([]);
  const [stats, setStats] = useState({ totalAccounts: 0, totalBalance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [newUser, setNewUser] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phoneNumber: '', address: '', dateOfBirth: ''
  });
  const [newAccount, setNewAccount] = useState({
    email: '', accountType: 'SAVINGS', accountNumber: '', initialBalance: ''
  });
  const [deposit, setDeposit] = useState({
    accountNumber: '', amount: ''
  });
  const [transfer, setTransfer] = useState({
    fromAccountNumber: '', toAccountNumber: '', amount: ''
  });

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!token || !isAdmin) {
      navigate('/login');
      return;
    }
    
    loadInitialData();
  }, [navigate]);

  const loadInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      // Load customers first
      const customersData = await adminService.getAllCustomers();
      setCustomers(customersData);

      // Load stats separately
      try {
        const statsData = await adminService.getStats();
        setStats({
          totalAccounts: statsData.totalAccounts || 0,
          totalBalance: statsData.totalBalance || 0
        });
      } catch (statsError) {
        console.error('Error loading stats:', statsError);
        // Don't set error state for stats failure
      }

      // Try loading other data
      try {
        const [pendingLoansData, allLoansData, fixedDepositsData] = await Promise.all([
          adminService.getPendingLoans(),
          adminService.getAllLoans(),
          adminService.getAllFixedDeposits()
        ]);

        setPendingLoans(pendingLoansData || []);
        setAllLoans(allLoansData || []);
        setFixedDeposits(fixedDepositsData || []);
      } catch (otherError) {
        console.error('Error loading additional data:', otherError);
        // Set these to empty arrays if loading fails
        setPendingLoans([]);
        setAllLoans([]);
        setFixedDeposits([]);
      }
    } catch (err) {
      console.error('Error loading customers:', err);
      if (err.message.includes('401') || err.message.includes('403')) {
    navigate('/login');
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submissions
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.createUser(newUser);
      setNewUser({
        firstName: '', lastName: '', email: '', password: '',
        phoneNumber: '', address: '', dateOfBirth: ''
      });
      loadInitialData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.createAccount(newAccount);
      setNewAccount({
        email: '', accountType: 'SAVINGS', accountNumber: '', initialBalance: ''
      });
      loadInitialData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.makeDeposit(deposit.accountNumber, parseFloat(deposit.amount));
      setDeposit({ accountNumber: '', amount: '' });
      loadInitialData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.makeTransfer(
        transfer.fromAccountNumber,
        transfer.toAccountNumber,
        parseFloat(transfer.amount)
      );
      setTransfer({ fromAccountNumber: '', toAccountNumber: '', amount: '' });
      loadInitialData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoanAction = async (loanId, status) => {
    setError('');
    try {
      await adminService.updateLoanStatus(loanId, status);
      loadInitialData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Total Accounts</Card.Title>
              <Card.Text className="h2">{stats.totalAccounts}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Total Balance</Card.Title>
              <Card.Text className="h2">₹{stats.totalBalance.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create User Form */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Create New User</Card.Title>
          <Form onSubmit={handleCreateUser}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={newUser.phoneNumber}
                    onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.address}
                    onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={newUser.dateOfBirth}
                    onChange={(e) => setNewUser({...newUser, dateOfBirth: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">Create User</Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Create Account Form */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Create New Account</Card.Title>
          <Form onSubmit={handleCreateAccount}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newAccount.email}
                    onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Type</Form.Label>
                  <Form.Select
                    value={newAccount.accountType}
                    onChange={(e) => setNewAccount({...newAccount, accountType: e.target.value})}
                    required
                  >
                    <option value="SAVINGS">Savings</option>
                    <option value="CHECKING">Checking</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Initial Balance</Form.Label>
                  <Form.Control
                    type="number"
                    value={newAccount.initialBalance}
                    onChange={(e) => setNewAccount({...newAccount, initialBalance: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">Create Account</Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Deposit Section */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Make Deposit</Card.Title>
          <Form onSubmit={handleDeposit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={deposit.accountNumber}
                    onChange={(e) => setDeposit({...deposit, accountNumber: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={deposit.amount}
                    onChange={(e) => setDeposit({...deposit, amount: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">Make Deposit</Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Transfer Section */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Make Transfer</Card.Title>
          <Form onSubmit={handleTransfer}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>From Account</Form.Label>
                  <Form.Control
                    type="text"
                    value={transfer.fromAccountNumber}
                    onChange={(e) => setTransfer({...transfer, fromAccountNumber: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>To Account</Form.Label>
                  <Form.Control
                    type="text"
                    value={transfer.toAccountNumber}
                    onChange={(e) => setTransfer({...transfer, toAccountNumber: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={transfer.amount}
                    onChange={(e) => setTransfer({...transfer, amount: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">Make Transfer</Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Pending Loans Table */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Pending Loans</Card.Title>
          <Table responsive>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Account Number</th>
                <th>Amount</th>
                <th>Interest Rate (%)</th>
                <th>Tenure (Months)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLoans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No pending loans</td>
                </tr>
              ) : (
                pendingLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.id}</td>
                    <td>{loan.account?.accountNumber}</td>
                    <td>₹{loan.amount}</td>
                    <td>{loan.interestRate}</td>
                    <td>{loan.termMonths}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleLoanAction(loan.id, 'APPROVED')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleLoanAction(loan.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* All Loans Table */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>All Loans</Card.Title>
          <Table responsive>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Account Number</th>
                <th>Amount</th>
                <th>Interest Rate (%)</th>
                <th>Tenure (Months)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allLoans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No loans found</td>
                </tr>
              ) : (
                allLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.id}</td>
                    <td>{loan.account?.accountNumber}</td>
                    <td>₹{loan.amount}</td>
                    <td>{loan.interestRate}</td>
                    <td>{loan.termMonths}</td>
                    <td>
                      <Badge bg={loan.status === 'APPROVED' ? 'success' : 
                                loan.status === 'PENDING' ? 'warning' : 'danger'}>
                        {loan.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Fixed Deposits Section */}
      <FixedDepositsList />

      {/* Customers Table */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>All Customers</Card.Title>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No customers found</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.email}>
                    <td>{`${customer.firstName} ${customer.lastName}`}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phoneNumber}</td>
                    <td>{customer.address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard; 