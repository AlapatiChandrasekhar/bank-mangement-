package com.example.bank.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FixedDepositDTO {
    private Long id;
    private BigDecimal amount;
    private BigDecimal interestRate;
    private LocalDate maturityDate;
    private LocalDateTime createdAt;
    private Long userId;
    private String username;
} 