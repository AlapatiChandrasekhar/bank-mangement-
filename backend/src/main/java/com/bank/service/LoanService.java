package com.bank.service;

import com.bank.model.Loan;
import com.bank.model.Customer;
import java.util.List;

public interface LoanService {
    Loan createLoan(Loan loan);
    List<Loan> getAllLoans();
    List<Loan> getNonRejectedLoans();
    List<Loan> getLoansByCustomer(Customer customer);
    List<Loan> getLoansByAccountNumber(String accountNumber);
    Loan updateLoan(Loan loan);
    void deleteLoan(Long id);
    List<Loan> getPendingLoans();
    Loan approveLoan(Long id, String remarks);
    Loan rejectLoan(Long id, String remarks);
    Loan getLoanById(Long id);
    double calculateEMI(double principal, double rate, int tenure);
} 