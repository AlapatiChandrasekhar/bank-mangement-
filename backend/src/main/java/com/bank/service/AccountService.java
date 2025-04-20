package com.bank.service;

import com.bank.model.Account;
import com.bank.model.Customer;
import java.util.List;
import java.util.Optional;

public interface AccountService {
    Account createAccount(Account account);
    Optional<Account> getAccountById(Long id);
    List<Account> getAllAccounts();
    List<Account> getAccountsByCustomer(Customer customer);
    Account updateAccount(Account account);
    void deleteAccount(Long id);
    Account deposit(String accountNumber, double amount);
    Account withdraw(String accountNumber, double amount);
    void transfer(String fromAccountNumber, String toAccountNumber, double amount);
    Optional<Account> getAccountByAccountNumber(String accountNumber);
    List<Account> getAccountsByCustomerId(Long customerId);
} 