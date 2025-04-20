package com.bank.repository;

import com.bank.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t WHERE t.fromAccount.customer.id = :customerId OR t.toAccount.customer.id = :customerId ORDER BY t.timestamp DESC")
    List<Transaction> findByCustomerId(Long customerId);
} 