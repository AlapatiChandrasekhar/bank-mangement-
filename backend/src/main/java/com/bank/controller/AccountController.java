package com.bank.controller;

import com.bank.model.Account;
import com.bank.model.Customer;
import com.bank.service.AccountService;
import com.bank.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private CustomerService customerService;

    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody Map<String, Object> request) {
        try {
            // Safely get values from request
            String accountNumber = request.get("accountNumber") != null ? request.get("accountNumber").toString() : null;
            String accountType = request.get("accountType") != null ? request.get("accountType").toString() : null;
            Long customerId = request.get("customerId") != null ? Long.parseLong(request.get("customerId").toString()) : null;

            // Validate required fields
            if (accountNumber == null || !accountNumber.matches("\\d{10}")) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Valid 10-digit account number is required"));
            }
            if (accountType == null || accountType.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Account type is required"));
            }
            if (customerId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Customer ID is required"));
            }

            // Get customer
            Customer customer = customerService.getCustomerById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

            // Check if account exists and belongs to this customer
            Optional<Account> existingAccount = accountService.getAccountByAccountNumber(accountNumber);
            if (existingAccount.isPresent()) {
                Account account = existingAccount.get();
                if (account.getCustomer().getId().equals(customerId)) {
                    // Account exists and belongs to this customer
                    return ResponseEntity.ok(account);
                } else {
                    return ResponseEntity.badRequest()
                        .body(Map.of("message", "This account number is not associated with your profile"));
                }
            }

            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid account number. Please contact admin for assistance."));

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid customer ID format"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Error processing request: " + e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateAccount(@RequestParam String accountNumber, @RequestParam String email) {
        try {
            Optional<Account> account = accountService.getAccountByAccountNumber(accountNumber);
            if (account.isPresent()) {
                Customer customer = account.get().getCustomer();
                boolean isValid = customer.getEmail().equals(email);
                
                Map<String, Object> response = new HashMap<>();
                response.put("valid", isValid);
                if (!isValid) {
                    response.put("message", "This account number does not belong to your profile");
                }
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.ok(Map.of("valid", false, "message", "Account not found"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("valid", false, "message", "Error validating account: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAccountsByCustomerId(@RequestParam Long customerId) {
        return ResponseEntity.ok(accountService.getAccountsByCustomerId(customerId));
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> request) {
        try {
            String accountNumber = (String) request.get("accountNumber");
            double amount = Double.parseDouble(request.get("amount").toString());
            
            Account updatedAccount = accountService.deposit(accountNumber, amount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Deposit successful");
            response.put("accountNumber", updatedAccount.getAccountNumber());
            response.put("balance", updatedAccount.getBalance());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Account> withdraw(@RequestBody Map<String, Object> request) {
        String accountNumber = (String) request.get("accountNumber");
        double amount = Double.parseDouble(request.get("amount").toString());
        return ResponseEntity.ok(accountService.withdraw(accountNumber, amount));
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody Map<String, Object> request) {
        try {
            String fromAccountNumber = (String) request.get("fromAccountNumber");
            String toAccountNumber = (String) request.get("toAccountNumber");
            double amount = Double.parseDouble(request.get("amount").toString());
            
            accountService.transfer(fromAccountNumber, toAccountNumber, amount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Transfer successful");
            response.put("fromAccount", fromAccountNumber);
            response.put("toAccount", toAccountNumber);
            response.put("amount", amount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<?> getAccountByNumber(@PathVariable String accountNumber) {
        try {
            Optional<Account> account = accountService.getAccountByAccountNumber(accountNumber);
            if (account.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("accountNumber", account.get().getAccountNumber());
                response.put("balance", account.get().getBalance());
                response.put("accountType", account.get().getAccountType());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Error fetching account: " + e.getMessage()));
        }
    }
} 