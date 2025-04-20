package com.example.bank.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountDTO {
    private Long id;
    private String accountNumber;
    private BigDecimal balance;
    private Long userId;
    private String username;
} 