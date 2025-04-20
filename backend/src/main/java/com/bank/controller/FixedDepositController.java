package com.bank.controller;

import com.bank.model.FixedDeposit;
import com.bank.model.Customer;
import com.bank.model.Account;
import com.bank.service.FixedDepositService;
import com.bank.service.CustomerService;
import com.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/fixed-deposits")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class FixedDepositController {

    @Autowired
    private FixedDepositService fixedDepositService;
    
    @Autowired
    private AccountService accountService;

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<?> getFixedDepositsByAccountNumber(@PathVariable String accountNumber) {
        try {
            System.out.println("Fetching fixed deposits for account: " + accountNumber);
            List<FixedDeposit> fixedDeposits = fixedDepositService.getFixedDepositsByAccountNumber(accountNumber);
            System.out.println("Found " + fixedDeposits.size() + " fixed deposits");
            return ResponseEntity.ok(fixedDeposits);
        } catch (Exception e) {
            System.err.println("Error fetching fixed deposits: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching fixed deposits: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> createFixedDeposit(@RequestBody Map<String, Object> request) {
        try {
            // Extract data from request
            String accountNumber = request.get("accountNumber").toString();
            double amount = Double.parseDouble(request.get("amount").toString());
            int tenure = Integer.parseInt(request.get("tenure").toString());
            double interestRate = Double.parseDouble(request.get("interestRate").toString());
            
            // Get account and check balance
            Account account = accountService.getAccountByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
            
            if (account.getBalance() < amount) {
                throw new RuntimeException("Insufficient balance. Available balance: ₹" + account.getBalance());
            }
            
            // Create fixed deposit
            FixedDeposit fixedDeposit = new FixedDeposit();
            fixedDeposit.setAmount(amount);
            fixedDeposit.setInterestRate(interestRate);
            fixedDeposit.setTermMonths(tenure);
            fixedDeposit.setCustomer(account.getCustomer());
            fixedDeposit.setAccount(account);
            fixedDeposit.setStatus("ACTIVE");
            fixedDeposit.setMaturityDate(LocalDate.now().plusMonths(tenure));
            
            // Save fixed deposit
            FixedDeposit savedFixedDeposit = fixedDepositService.createFixedDeposit(fixedDeposit);
            
            // Deduct amount from account
            account.setBalance(account.getBalance() - amount);
            accountService.updateAccount(account);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Fixed deposit created successfully");
            response.put("id", savedFixedDeposit.getId());
            response.put("amount", savedFixedDeposit.getAmount());
            response.put("interestRate", savedFixedDeposit.getInterestRate());
            response.put("termMonths", savedFixedDeposit.getTermMonths());
            response.put("maturityDate", savedFixedDeposit.getMaturityDate());
            response.put("remainingBalance", account.getBalance());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFixedDeposit(@PathVariable Long id) {
        return ResponseEntity.ok(fixedDepositService.getFixedDepositById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFixedDeposit(@PathVariable Long id) {
        fixedDepositService.deleteFixedDeposit(id);
        return ResponseEntity.ok().build();
    }
} 