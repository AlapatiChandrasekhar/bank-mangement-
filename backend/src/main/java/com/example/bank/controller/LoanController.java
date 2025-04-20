package com.example.bank.controller;

import com.example.bank.dto.LoanDTO;
import com.example.bank.model.LoanStatus;
import com.example.bank.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "http://localhost:3000")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PostMapping("/request")
    public ResponseEntity<LoanDTO> requestLoan(
            @RequestParam Long userId,
            @RequestParam Double amount,
            @RequestParam String purpose,
            @RequestParam Integer duration) {
        LoanDTO loanDTO = loanService.requestLoan(userId, amount, purpose, duration);
        return ResponseEntity.ok(loanDTO);
    }

    @PostMapping("/{loanId}/approve")
    public ResponseEntity<LoanDTO> approveLoan(
            @PathVariable Long loanId,
            @RequestParam Long adminId) {
        LoanDTO loanDTO = loanService.approveLoan(loanId, adminId);
        return ResponseEntity.ok(loanDTO);
    }

    @PostMapping("/{loanId}/reject")
    public ResponseEntity<LoanDTO> rejectLoan(
            @PathVariable Long loanId,
            @RequestParam Long adminId,
            @RequestParam String rejectionReason) {
        LoanDTO loanDTO = loanService.rejectLoan(loanId, adminId, rejectionReason);
        return ResponseEntity.ok(loanDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanDTO>> getUserLoans(@PathVariable Long userId) {
        List<LoanDTO> loans = loanService.getLoansByUserId(userId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LoanDTO>> getLoansByStatus(@PathVariable LoanStatus status) {
        List<LoanDTO> loans = loanService.getLoansByStatus(status);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<LoanDTO> getLoan(@PathVariable Long loanId) {
        LoanDTO loanDTO = loanService.getLoanById(loanId);
        return ResponseEntity.ok(loanDTO);
    }
} 