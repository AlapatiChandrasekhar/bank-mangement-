package com.bank.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

@Data
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String accountNumber;
    
    @Column(nullable = false)
    private double balance;
    
    @Column(nullable = false)
    private String accountType; // SAVINGS or CURRENT
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @OneToMany(mappedBy = "fromAccount", cascade = CascadeType.ALL)
    private Set<Transaction> outgoingTransactions;
    
    @OneToMany(mappedBy = "toAccount", cascade = CascadeType.ALL)
    private Set<Transaction> incomingTransactions;
} 