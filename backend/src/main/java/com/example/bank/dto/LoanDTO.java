package com.example.bank.dto;

import com.example.bank.model.LoanStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LoanDTO {
    private Long id;
    private BigDecimal amount;
    private String purpose;
    private Integer duration;
    private LoanStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private Long userId;
    private String username;
} 