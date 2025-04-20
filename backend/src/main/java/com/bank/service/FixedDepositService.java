package com.bank.service;

import com.bank.model.FixedDeposit;
import com.bank.model.Customer;
import java.util.List;

public interface FixedDepositService {
    FixedDeposit createFixedDeposit(FixedDeposit fixedDeposit);
    List<FixedDeposit> getAllFixedDeposits();
    List<FixedDeposit> getFixedDepositsByCustomer(Customer customer);
    FixedDeposit updateFixedDeposit(FixedDeposit fixedDeposit);
    void deleteFixedDeposit(Long id);
    double calculateMaturityAmount(double principal, double interestRate, int tenure);
    FixedDeposit getFixedDepositById(Long id);
    List<FixedDeposit> getFixedDepositsByCustomerId(Long customerId);
    List<FixedDeposit> getFixedDepositsByAccountNumber(String accountNumber);
} 