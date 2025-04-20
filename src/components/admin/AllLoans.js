import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const AllLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [rejectRemarks, setRejectRemarks] = useState('');
    const [showRejected, setShowRejected] = useState(false);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllLoans();
            console.log('Fetched loans:', response);
            setLoans(response || []);
        } catch (error) {
            console.error('Error fetching loans:', error);
            toast.error('Failed to fetch loans: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoanAction = async (loanId, action) => {
        if (action === 'REJECT') {
            setSelectedLoan(loanId);
            setShowRejectModal(true);
            return;
        }

        try {
            console.log(`Attempting to ${action} loan ${loanId}`);
            await adminService.updateLoanStatus(loanId, action);
            toast.success(`Loan ${action === 'APPROVED' ? 'approved' : 'rejected'} successfully`);
            fetchLoans();
        } catch (error) {
            console.error(`Error ${action.toLowerCase()}ing loan:`, error);
            toast.error(`Failed to ${action.toLowerCase()} loan: ` + error.message);
        }
    };

    const handleRejectConfirm = async () => {
        try {
            await adminService.updateLoanStatus(selectedLoan, 'REJECTED', rejectRemarks);
            toast.success('Loan rejected successfully');
            setShowRejectModal(false);
            setRejectRemarks('');
            setSelectedLoan(null);
            fetchLoans();
        } catch (error) {
            console.error('Error rejecting loan:', error);
            toast.error('Failed to reject loan: ' + error.message);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'APPROVED':
                return 'success';
            case 'REJECTED':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    if (loading) {
        return <div>Loading loans...</div>;
    }

    // Filter loans based on showRejected state
    const filteredLoans = loans.filter(loan => showRejected || loan.status !== 'REJECTED');

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>All Loans</h2>
                <Form.Check
                    type="switch"
                    id="show-rejected"
                    label="Show Rejected Loans"
                    checked={showRejected}
                    onChange={(e) => setShowRejected(e.target.checked)}
                />
            </div>
            
            {filteredLoans.length === 0 ? (
                <div className="alert alert-info">No loans found</div>
            ) : (
                <Table responsive striped bordered hover>
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
                        {filteredLoans.map((loan) => (
                            <tr key={loan.id}>
                                <td>{loan.id}</td>
                                <td>{loan.account?.accountNumber}</td>
                                <td>₹{loan.amount?.toLocaleString()}</td>
                                <td>{loan.interestRate}</td>
                                <td>{loan.termMonths}</td>
                                <td>
                                    <Badge bg={getStatusBadgeVariant(loan.status)}>
                                        {loan.status}
                                    </Badge>
                                </td>
                                <td>
                                    {loan.status === 'PENDING' && (
                                        <>
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
                                                onClick={() => handleLoanAction(loan.id, 'REJECT')}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject Loan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Rejection Remarks</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={rejectRemarks}
                            onChange={(e) => setRejectRemarks(e.target.value)}
                            placeholder="Enter reason for rejection"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleRejectConfirm}>
                        Confirm Reject
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllLoans; 