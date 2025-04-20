package com.bank.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String loanType;
    
    @Column(nullable = false)
    private double amount;
    
    @Column(nullable = false)
    private double interestRate;
    
    @Column(nullable = false)
    private int termMonths;
    
    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED
    
    @Column(nullable = false)
    private LocalDateTime applicationDate;
    
    @Column
    private LocalDateTime approvalDate;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
    
    @Column
    private String remarks;
} 