package com.bank.service.impl;

import com.bank.model.Loan;
import com.bank.model.Customer;
import com.bank.model.Account;
import com.bank.repository.LoanRepository;
import com.bank.service.LoanService;
import com.bank.service.AccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanServiceImpl implements LoanService {
    
    private static final Logger logger = LoggerFactory.getLogger(LoanServiceImpl.class);
    
    @Autowired
    private LoanRepository loanRepository;
    
    @Autowired
    private AccountService accountService;
    
    @Override
    @Transactional
    public Loan createLoan(Loan loan) {
        logger.info("Creating new loan application for customer: {}", loan.getCustomer().getId());
        loan.setStatus("PENDING");
        loan.setApplicationDate(LocalDateTime.now());
        return loanRepository.save(loan);
    }
    
    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }
    
    @Override
    public List<Loan> getNonRejectedLoans() {
        return loanRepository.findByStatusNot("REJECTED");
    }
    
    @Override
    public List<Loan> getLoansByCustomer(Customer customer) {
        return loanRepository.findByCustomer(customer);
    }
    
    @Override
    public List<Loan> getPendingLoans() {
        return loanRepository.findByStatus("PENDING");
    }
    
    @Override
    @Transactional
    public Loan updateLoan(Loan loan) {
        return loanRepository.save(loan);
    }
    
    @Override
    @Transactional
    public void deleteLoan(Long id) {
        loanRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public Loan approveLoan(Long id, String remarks) {
        logger.info("Processing loan approval for ID: {}", id);
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with ID: " + id));

        if (!"PENDING".equals(loan.getStatus())) {
            throw new RuntimeException("Loan is not in PENDING status");
        }

        try {
            loan.setStatus("APPROVED");
            loan.setApprovalDate(LocalDateTime.now());
            loan.setRemarks(remarks);
            
            Account account = loan.getAccount();
            account.setBalance(account.getBalance() + loan.getAmount());
            accountService.updateAccount(account);
            
            Loan savedLoan = loanRepository.save(loan);
            logger.info("Loan {} approved successfully and amount {} added to account {}", 
                id, loan.getAmount(), account.getAccountNumber());
            
            return savedLoan;
        } catch (Exception e) {
            logger.error("Error while approving loan: {}", e.getMessage());
            throw new RuntimeException("Failed to approve loan: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public Loan rejectLoan(Long id, String remarks) {
        logger.info("Processing loan rejection for ID: {}", id);
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with ID: " + id));

        if (!"PENDING".equals(loan.getStatus())) {
            throw new RuntimeException("Loan is not in PENDING status");
        }

        try {
            loan.setStatus("REJECTED");
            loan.setApprovalDate(LocalDateTime.now());
            loan.setRemarks(remarks);
            
            Loan savedLoan = loanRepository.save(loan);
            logger.info("Loan {} rejected successfully", id);
            
            return savedLoan;
        } catch (Exception e) {
            logger.error("Error while rejecting loan: {}", e.getMessage());
            throw new RuntimeException("Failed to reject loan: " + e.getMessage());
        }
    }

    @Override
    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Loan not found"));
    }
    
    @Override
    public double calculateEMI(double principal, double interestRate, int tenure) {
        double monthlyRate = (interestRate / 12) / 100;
        double emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure))
                / (Math.pow(1 + monthlyRate, tenure) - 1);
        return Math.round(emi * 100.0) / 100.0;
    }

    @Override
    public List<Loan> getLoansByAccountNumber(String accountNumber) {
        logger.info("Fetching loans for account number: {}", accountNumber);
        List<Loan> loans = loanRepository.findByAccount_AccountNumber(accountNumber);
        logger.info("Found {} loans for account: {}", loans.size(), accountNumber);
        return loans;
    }
} 