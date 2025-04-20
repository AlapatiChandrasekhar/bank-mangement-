package com.example.bank.service;

import com.example.bank.dto.LoanDTO;
import com.example.bank.model.LoanStatus;
import java.util.List;

public interface LoanService {
    LoanDTO requestLoan(Long userId, Double amount, String purpose, Integer duration);
    LoanDTO approveLoan(Long loanId, Long adminId);
    LoanDTO rejectLoan(Long loanId, Long adminId, String rejectionReason);
    List<LoanDTO> getLoansByUserId(Long userId);
    List<LoanDTO> getLoansByStatus(LoanStatus status);
    LoanDTO getLoanById(Long loanId);
} 