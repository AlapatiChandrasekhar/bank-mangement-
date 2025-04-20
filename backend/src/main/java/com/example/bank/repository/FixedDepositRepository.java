package com.example.bank.repository;

import com.example.bank.model.FixedDeposit;
import com.example.bank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {
    List<FixedDeposit> findByUser(User user);
} 