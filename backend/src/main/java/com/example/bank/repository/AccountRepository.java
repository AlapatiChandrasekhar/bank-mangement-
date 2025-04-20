package com.example.bank.repository;

import com.example.bank.model.Account;
import com.example.bank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByUser(User user);
    boolean existsByAccountNumber(String accountNumber);
} 