package com.example.bank.service.impl;

import com.example.bank.dto.LoanDTO;
import com.example.bank.model.Loan;
import com.example.bank.model.LoanStatus;
import com.example.bank.model.User;
import com.example.bank.repository.LoanRepository;
import com.example.bank.repository.UserRepository;
import com.example.bank.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanServiceImpl implements LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public LoanDTO requestLoan(Long userId, Double amount, String purpose, Integer duration) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setAmount(BigDecimal.valueOf(amount));
        loan.setPurpose(purpose);
        loan.setDuration(duration);
        loan.setStatus(LoanStatus.PENDING);

        Loan savedLoan = loanRepository.save(loan);
        return convertToDTO(savedLoan);
    }

    @Override
    @Transactional
    public LoanDTO approveLoan(Long loanId, Long adminId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new RuntimeException("Loan is not in pending status");
        }

        loan.setStatus(LoanStatus.APPROVED);
        Loan savedLoan = loanRepository.save(loan);
        return convertToDTO(savedLoan);
    }

    @Override
    @Transactional
    public LoanDTO rejectLoan(Long loanId, Long adminId, String rejectionReason) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new RuntimeException("Loan is not in pending status");
        }

        loan.setStatus(LoanStatus.REJECTED);
        loan.setRejectionReason(rejectionReason);
        Loan savedLoan = loanRepository.save(loan);
        return convertToDTO(savedLoan);
    }

    @Override
    public List<LoanDTO> getLoansByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return loanRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LoanDTO> getLoansByStatus(LoanStatus status) {
        return loanRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LoanDTO getLoanById(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        return convertToDTO(loan);
    }

    private LoanDTO convertToDTO(Loan loan) {
        LoanDTO dto = new LoanDTO();
        dto.setId(loan.getId());
        dto.setAmount(loan.getAmount());
        dto.setPurpose(loan.getPurpose());
        dto.setDuration(loan.getDuration());
        dto.setStatus(loan.getStatus());
        dto.setRejectionReason(loan.getRejectionReason());
        dto.setCreatedAt(loan.getCreatedAt());
        dto.setUserId(loan.getUser().getId());
        dto.setUsername(loan.getUser().getUsername());
        return dto;
    }
} 