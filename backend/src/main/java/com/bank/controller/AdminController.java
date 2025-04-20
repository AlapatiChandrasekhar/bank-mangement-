package com.bank.controller;

import com.bank.model.Customer;
import com.bank.model.Loan;
import com.bank.model.FixedDeposit;
import com.bank.model.Account;
import com.bank.service.CustomerService;
import com.bank.service.LoanService;
import com.bank.service.FixedDepositService;
import com.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private CustomerService customerService;

    @Autowired
    private LoanService loanService;

    @Autowired
    private FixedDepositService fixedDepositService;

    @Autowired
    private AccountService accountService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            List<Customer> customers = customerService.getAllCustomers();
            List<Account> accounts = accountService.getAllAccounts();
            List<Loan> loans = loanService.getAllLoans();
            List<FixedDeposit> fds = fixedDepositService.getAllFixedDeposits();

            stats.put("totalUsers", customers.size());
            stats.put("totalAccounts", accounts.size());
            stats.put("totalBalance", accounts.stream().mapToDouble(Account::getBalance).sum());
            stats.put("activeLoans", loans.stream().filter(loan -> "APPROVED".equals(loan.getStatus())).count());
            stats.put("pendingLoans", loans.stream().filter(loan -> "PENDING".equals(loan.getStatus())).count());
            stats.put("totalLoanAmount", loans.stream()
                    .filter(loan -> "APPROVED".equals(loan.getStatus()))
                    .mapToDouble(Loan::getAmount)
                    .sum());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Error fetching stats: " + e.getMessage()));
        }
    }

    @PostMapping("/users/create")
    public ResponseEntity<?> createUser(@RequestBody Customer customer) {
        try {
            // Validate required fields
            if (customer.getEmail() == null || customer.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
            }
            if (customer.getPassword() == null || customer.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
            }
            if (customer.getFirstName() == null || customer.getFirstName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "First name is required"));
            }
            if (customer.getLastName() == null || customer.getLastName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Last name is required"));
            }
            
            // Check if email already exists
            if (customerService.getCustomerByEmail(customer.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));
            }
            
            // Create customer
            Customer savedCustomer = customerService.createCustomer(customer);
            
            return ResponseEntity.ok(savedCustomer);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Error creating user: " + e.getMessage()));
        }
    }

    @PostMapping("/accounts")
    public ResponseEntity<?> createAccount(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            String accountType = (String) request.get("accountType");
            String accountNumber = (String) request.get("accountNumber");
            double initialBalance = Double.parseDouble(request.get("initialBalance").toString());

            // Validate required fields
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
            }
            if (accountType == null || accountType.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Account type is required"));
            }
            if (accountNumber == null || accountNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Account number is required"));
            }

            // Get customer by email
            Customer customer = customerService.getCustomerByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

            // Check if account number already exists
            if (accountService.getAccountByAccountNumber(accountNumber).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Account number already exists"));
            }

            // Create account
            Account account = new Account();
            account.setAccountNumber(accountNumber);
            account.setAccountType(accountType);
            account.setBalance(initialBalance);
            account.setCustomer(customer);

            Account savedAccount = accountService.createAccount(account);
            return ResponseEntity.ok(savedAccount);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Error creating account: " + e.getMessage()));
        }
    }

    @GetMapping("/generate-account-number")
    public ResponseEntity<?> generateAccountNumber() {
        try {
            // Generate a random 10-digit account number
            String accountNumber = String.format("%010d", (long) (Math.random() * 10000000000L));
            return ResponseEntity.ok(Map.of("accountNumber", accountNumber));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Error generating account number: " + e.getMessage()));
        }
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/customers")
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/customers/{id}/account")
    public ResponseEntity<?> assignAccountNumber(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String accountNumber = request.get("accountNumber");
        return ResponseEntity.ok(customerService.assignAccountNumber(id, accountNumber));
    }

    @GetMapping("/loans/pending")
    public ResponseEntity<List<Loan>> getPendingLoans() {
        return ResponseEntity.ok(loanService.getPendingLoans());
    }

    @GetMapping("/loans/all")
    public ResponseEntity<List<Loan>> getAllLoans(@RequestParam(required = false) Boolean includeRejected) {
        try {
            List<Loan> loans;
            if (Boolean.TRUE.equals(includeRejected)) {
                loans = loanService.getAllLoans();
            } else {
                loans = loanService.getNonRejectedLoans();
            }
            return ResponseEntity.ok(loans);
        } catch (Exception e) {
            logger.error("Error fetching loans: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/loans/{id}/approve")
    public ResponseEntity<?> approveLoan(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String remarks = request.getOrDefault("remarks", "");
            logger.info("Approving loan with ID: {} and remarks: {}", id, remarks);
            
            Loan approvedLoan = loanService.approveLoan(id, remarks);
            logger.info("Loan approved successfully: {}", approvedLoan.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Loan approved successfully");
            response.put("status", approvedLoan.getStatus());
            response.put("approvalDate", approvedLoan.getApprovalDate());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error approving loan: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Error approving loan: " + e.getMessage()));
        }
    }

    @PostMapping("/loans/{id}/reject")
    public ResponseEntity<?> rejectLoan(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String remarks = request.getOrDefault("remarks", "");
            logger.info("Rejecting loan with ID: {} and remarks: {}", id, remarks);
            
            Loan rejectedLoan = loanService.rejectLoan(id, remarks);
            logger.info("Loan rejected successfully: {}", rejectedLoan.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Loan rejected successfully");
            response.put("status", rejectedLoan.getStatus());
            response.put("approvalDate", rejectedLoan.getApprovalDate());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error rejecting loan: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Error rejecting loan: " + e.getMessage()));
        }
    }

    @GetMapping("/fixed-deposits")
    public ResponseEntity<List<FixedDeposit>> getAllFixedDeposits() {
        return ResponseEntity.ok(fixedDepositService.getAllFixedDeposits());
    }

    @PostMapping("/accounts/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> request) {
        String accountNumber = (String) request.get("accountNumber");
        double amount = Double.parseDouble(request.get("amount").toString());
        return ResponseEntity.ok(accountService.deposit(accountNumber, amount));
    }

    @GetMapping("/kyc/{accountNumber}")
    public ResponseEntity<?> validateAccountNumber(@PathVariable String accountNumber) {
        try {
            // Check if the account number exists in our system
            boolean isAlreadyUsed = accountService.getAccountByAccountNumber(accountNumber).isPresent();
            
            if (isAlreadyUsed) {
                return ResponseEntity.status(404)
                    .body(Map.of("message", "Account number is already in use"));
            }
            
            // Validate account number format
            if (!accountNumber.matches("\\d{10}")) {
                return ResponseEntity.status(404)
                    .body(Map.of("message", "Invalid account number format. Must be 10 digits."));
            }
            
            return ResponseEntity.ok()
                .body(Map.of("message", "Account number is available", "isValid", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Error validating account number: " + e.getMessage()));
        }
    }
} 