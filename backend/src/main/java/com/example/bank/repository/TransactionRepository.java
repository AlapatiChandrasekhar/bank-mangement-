package com.example.bank.repository;

import com.example.bank.model.Transaction;
import com.example.bank.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySenderAccountOrReceiverAccount(Account senderAccount, Account receiverAccount);
} 