package com.example.bank.controller;

import com.example.bank.dto.AccountDTO;
import com.example.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(
            @RequestParam String accountNumber,
            @RequestParam Long userId,
            @RequestParam Long adminId) {
        AccountDTO accountDTO = accountService.createAccount(accountNumber, userId, adminId);
        return ResponseEntity.ok(accountDTO);
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountDTO> getAccount(@PathVariable String accountNumber) {
        AccountDTO accountDTO = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(accountDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountDTO>> getUserAccounts(@PathVariable Long userId) {
        List<AccountDTO> accounts = accountService.getAccountsByUserId(userId);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/deposit")
    public ResponseEntity<Void> deposit(
            @RequestParam String accountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam Long adminId) {
        accountService.deposit(accountNumber, amount, adminId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/transfer")
    public ResponseEntity<Void> transfer(
            @RequestParam String fromAccountNumber,
            @RequestParam String toAccountNumber,
            @RequestParam BigDecimal amount) {
        accountService.transfer(fromAccountNumber, toAccountNumber, amount);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{accountNumber}/balance")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable String accountNumber) {
        BigDecimal balance = accountService.getBalance(accountNumber);
        return ResponseEntity.ok(balance);
    }
} 