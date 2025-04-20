package com.bank.repository;

import com.bank.model.FixedDeposit;
import com.bank.model.Customer;
import com.bank.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {
    List<FixedDeposit> findByCustomer(Customer customer);
    List<FixedDeposit> findByStatus(String status);
    List<FixedDeposit> findByCustomerAndStatus(Customer customer, String status);
    List<FixedDeposit> findByCustomerId(Long customerId);
    List<FixedDeposit> findByAccount_AccountNumber(String accountNumber);
} 