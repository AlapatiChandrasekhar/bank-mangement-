package com.bank.controller;

import com.bank.model.Loan;
import com.bank.model.Customer;
import com.bank.model.Account;
import com.bank.service.LoanService;
import com.bank.service.CustomerService;
import com.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class LoanController {

    private static final Logger logger = LoggerFactory.getLogger(LoanController.class);

    @Autowired
    private LoanService loanService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private AccountService accountService;

    @PostMapping
    public ResponseEntity<?> createLoan(@RequestBody Map<String, Object> request) {
        try {
            String accountNumber = request.get("accountNumber").toString();
            double amount = Double.parseDouble(request.get("amount").toString());
            double interestRate = Double.parseDouble(request.get("interestRate").toString());
            int termMonths = Integer.parseInt(request.get("tenure").toString());

            logger.info("Creating loan for account: {}, amount: {}", accountNumber, amount);

            Account account = accountService.getAccountByAccountNumber(accountNumber)
                    .orElseThrow(() -> new RuntimeException("Account not found: " + accountNumber));

            Loan loan = new Loan();
            loan.setCustomer(account.getCustomer());
            loan.setAmount(amount);
            loan.setInterestRate(interestRate);
            loan.setTermMonths(termMonths);
            loan.setStatus("PENDING");
            loan.setAccount(account);
            loan.setApplicationDate(LocalDateTime.now());
            loan.setLoanType("PERSONAL"); // Setting a default loan type

            Loan savedLoan = loanService.createLoan(loan);
            logger.info("Loan created successfully with ID: {}", savedLoan.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Loan application submitted successfully");
            response.put("loanId", savedLoan.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating loan: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<?> getCustomerLoans(@RequestParam String accountNumber) {
        try {
            logger.info("Fetching loans for account number: {}", accountNumber);
            List<Loan> loans = loanService.getLoansByAccountNumber(accountNumber);
            logger.info("Found {} loans for account number: {}", loans.size(), accountNumber);
            return ResponseEntity.ok(loans);
        } catch (Exception e) {
            logger.error("Error fetching loans for account {}: {}", accountNumber, e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error fetching loans: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllLoans() {
        try {
            logger.info("Fetching all loans");
            List<Loan> loans = loanService.getAllLoans();
            logger.info("Found {} loans", loans.size());
            return ResponseEntity.ok(loans);
        } catch (Exception e) {
            logger.error("Error fetching all loans: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error fetching loans: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLoan(@PathVariable Long id, @RequestBody Loan loan) {
        loan.setId(id);
        return ResponseEntity.ok(loanService.updateLoan(loan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLoan(@PathVariable Long id) {
        loanService.deleteLoan(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingLoans() {
        try {
            logger.info("Fetching pending loans");
            List<Loan> pendingLoans = loanService.getPendingLoans();
            logger.info("Found {} pending loans", pendingLoans.size());
            return ResponseEntity.ok(pendingLoans);
        } catch (Exception e) {
            logger.error("Error fetching pending loans: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error fetching pending loans: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/{loanId}/approve")
    public ResponseEntity<?> approveLoan(@PathVariable Long loanId, @RequestBody Map<String, String> request) {
        try {
            String remarks = request.get("remarks");
            Loan approvedLoan = loanService.approveLoan(loanId, remarks);
            Account account = approvedLoan.getAccount();
            
            // Update account balance
            double newBalance = account.getBalance() + approvedLoan.getAmount();
            account.setBalance(newBalance);
            accountService.updateAccount(account);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Loan approved successfully");
            response.put("newBalance", newBalance);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error approving loan: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/{loanId}/reject")
    public ResponseEntity<?> rejectLoan(@PathVariable Long loanId, @RequestBody Map<String, String> request) {
        try {
            String remarks = request.get("remarks");
            Loan rejectedLoan = loanService.rejectLoan(loanId, remarks);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Loan rejected successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error rejecting loan: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/calculate-emi")
    public ResponseEntity<?> calculateEMI(@RequestParam double principal, 
                                        @RequestParam double interestRate, 
                                        @RequestParam int tenure) {
        double emi = loanService.calculateEMI(principal, interestRate, tenure);
        return ResponseEntity.ok(emi);
    }
} 