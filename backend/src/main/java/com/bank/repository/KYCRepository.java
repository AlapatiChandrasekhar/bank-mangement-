package com.bank.repository;

import com.bank.model.KYC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface KYCRepository extends JpaRepository<KYC, Long> {
    Optional<KYC> findByAccountNumber(String accountNumber);
    boolean existsByAccountNumber(String accountNumber);
} 