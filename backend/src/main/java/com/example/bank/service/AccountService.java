package com.example.bank.service;

import com.example.bank.dto.AccountDTO;
import java.math.BigDecimal;
import java.util.List;

public interface AccountService {
    AccountDTO createAccount(String accountNumber, Long userId, Long adminId);
    AccountDTO getAccountByNumber(String accountNumber);
    List<AccountDTO> getAccountsByUserId(Long userId);
    void deposit(String accountNumber, BigDecimal amount, Long adminId);
    void transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount);
    BigDecimal getBalance(String accountNumber);
} 