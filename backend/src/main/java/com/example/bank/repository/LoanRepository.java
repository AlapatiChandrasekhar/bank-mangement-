package com.example.bank.repository;

import com.example.bank.model.Loan;
import com.example.bank.model.User;
import com.example.bank.model.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUser(User user);
    List<Loan> findByStatus(LoanStatus status);
} 