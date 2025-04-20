package com.bank.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.Set;

@Data
@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    // Admin specific fields
    @Column(nullable = false)
    private boolean isAdmin = false;

    @Column(nullable = false)
    private String password;

    @Column
    private String accountNumber; // Account number assigned by admin

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<Account> accounts;

    private String aadharNumber;
    private String panNumber;
    private String gender;
    private String occupation;
    private double annualIncome;
} 