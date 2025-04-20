import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.isAdmin;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold">Bank Management System</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Account Management */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Account Management</h2>
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/accounts')}
                                    className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                    View Accounts
                                </button>
                                <button
                                    onClick={() => navigate('/transactions')}
                                    className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                    Transaction History
                                </button>
                            </div>
                        </div>

                        {/* Loan Management */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Loan Management</h2>
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/loans')}
                                    className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                    View Loans
                                </button>
                                <button
                                    onClick={() => navigate('/loans/apply')}
                                    className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                    Apply for Loan
                                </button>
                            </div>
                        </div>

                        {/* Fixed Deposits */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Fixed Deposits</h2>
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/fixed-deposits')}
                                    className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                    View Fixed Deposits
                                </button>
                                <button
                                    onClick={() => navigate('/fixed-deposits/create')}
                                    className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                    Create Fixed Deposit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard; 