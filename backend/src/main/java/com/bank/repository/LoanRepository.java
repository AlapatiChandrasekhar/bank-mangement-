package com.bank.repository;

import com.bank.model.Loan;
import com.bank.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByCustomer(Customer customer);
    List<Loan> findByStatus(String status);
    List<Loan> findByCustomerAndStatus(Customer customer, String status);
    List<Loan> findByAccount_AccountNumber(String accountNumber);
    List<Loan> findByStatusNot(String status);
} 