package com.bank.service.impl;

import com.bank.model.FixedDeposit;
import com.bank.model.Customer;
import com.bank.repository.FixedDepositRepository;
import com.bank.service.FixedDepositService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FixedDepositServiceImpl implements FixedDepositService {

    private static final Logger logger = LoggerFactory.getLogger(FixedDepositServiceImpl.class);

    @Autowired
    private FixedDepositRepository fixedDepositRepository;

    @Override
    public FixedDeposit createFixedDeposit(FixedDeposit fixedDeposit) {
        return fixedDepositRepository.save(fixedDeposit);
    }

    @Override
    public List<FixedDeposit> getAllFixedDeposits() {
        return fixedDepositRepository.findAll();
    }

    @Override
    public List<FixedDeposit> getFixedDepositsByCustomer(Customer customer) {
        return fixedDepositRepository.findByCustomer(customer);
    }

    @Override
    public FixedDeposit updateFixedDeposit(FixedDeposit fixedDeposit) {
        return fixedDepositRepository.save(fixedDeposit);
    }

    @Override
    public void deleteFixedDeposit(Long id) {
        fixedDepositRepository.deleteById(id);
    }

    @Override
    public double calculateMaturityAmount(double principal, double interestRate, int tenure) {
        double rate = interestRate / 100;
        return principal * Math.pow(1 + rate, tenure);
    }

    @Override
    public FixedDeposit getFixedDepositById(Long id) {
        return fixedDepositRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fixed Deposit not found"));
    }

    @Override
    public List<FixedDeposit> getFixedDepositsByCustomerId(Long customerId) {
        return fixedDepositRepository.findByCustomerId(customerId);
    }

    @Override
    public List<FixedDeposit> getFixedDepositsByAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.trim().isEmpty()) {
            logger.error("Account number cannot be null or empty");
            throw new IllegalArgumentException("Account number cannot be null or empty");
        }

        try {
            logger.info("Fetching fixed deposits for account number: {}", accountNumber);
            List<FixedDeposit> fixedDeposits = fixedDepositRepository.findByAccount_AccountNumber(accountNumber);
            logger.info("Found {} fixed deposits for account number: {}", fixedDeposits.size(), accountNumber);
            return fixedDeposits;
        } catch (Exception e) {
            logger.error("Error fetching fixed deposits for account number {}: {}", accountNumber, e.getMessage());
            throw new RuntimeException("Failed to fetch fixed deposits for account number: " + accountNumber, e);
        }
    }
} 