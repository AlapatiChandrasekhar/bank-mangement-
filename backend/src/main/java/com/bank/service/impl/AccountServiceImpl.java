package com.bank.service.impl;

import com.bank.model.Account;
import com.bank.model.Customer;
import com.bank.model.Transaction;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import com.bank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Override
    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }
    
    @Override
    public Optional<Account> getAccountById(Long id) {
        return accountRepository.findById(id);
    }
    
    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
    
    @Override
    public List<Account> getAccountsByCustomer(Customer customer) {
        return accountRepository.findByCustomer(customer);
    }
    
    @Override
    public Account updateAccount(Account account) {
        return accountRepository.save(account);
    }
    
    @Override
    public void deleteAccount(Long id) {
        accountRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public Account deposit(String accountNumber, double amount) {
        // Find the account
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found: " + accountNumber));
        
        // Update balance
        account.setBalance(account.getBalance() + amount);
        
        // Save and return
        return accountRepository.save(account);
    }
    
    @Override
    @Transactional
    public Account withdraw(String accountNumber, double amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }
        
        account.setBalance(account.getBalance() - amount);
        account = accountRepository.save(account);
        
        Transaction transaction = new Transaction();
        transaction.setFromAccount(account);
        transaction.setToAccount(null);
        transaction.setAmount(amount);
        transaction.setType("WITHDRAWAL");
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus("COMPLETED");
        transactionRepository.save(transaction);
        
        return account;
    }
    
    @Override
    @Transactional
    public void transfer(String fromAccountNumber, String toAccountNumber, double amount) {
        // Find both accounts
        Account fromAccount = accountRepository.findByAccountNumber(fromAccountNumber)
                .orElseThrow(() -> new RuntimeException("From account not found"));
        
        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new RuntimeException("To account not found"));
        
        // Check if sufficient balance
        if (fromAccount.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }
        
        // Update balances
        fromAccount.setBalance(fromAccount.getBalance() - amount);
        toAccount.setBalance(toAccount.getBalance() + amount);
        
        // Save both accounts
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
    }
    
    @Override
    public Optional<Account> getAccountByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }

    @Override
    public List<Account> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerId(customerId);
    }
} 