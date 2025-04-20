package com.example.bank.controller;

import com.example.bank.dto.FixedDepositDTO;
import com.example.bank.service.FixedDepositService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fixed-deposits")
@CrossOrigin(origins = "http://localhost:3000")
public class FixedDepositController {

    @Autowired
    private FixedDepositService fixedDepositService;

    @PostMapping
    public ResponseEntity<FixedDepositDTO> createFixedDeposit(
            @RequestParam Long userId,
            @RequestParam Double amount,
            @RequestParam Double interestRate,
            @RequestParam String maturityDate) {
        FixedDepositDTO fixedDepositDTO = fixedDepositService.createFixedDeposit(
                userId, amount, interestRate, maturityDate);
        return ResponseEntity.ok(fixedDepositDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FixedDepositDTO>> getUserFixedDeposits(@PathVariable Long userId) {
        List<FixedDepositDTO> deposits = fixedDepositService.getFixedDepositsByUserId(userId);
        return ResponseEntity.ok(deposits);
    }

    @GetMapping
    public ResponseEntity<List<FixedDepositDTO>> getAllFixedDeposits() {
        List<FixedDepositDTO> deposits = fixedDepositService.getAllFixedDeposits();
        return ResponseEntity.ok(deposits);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FixedDepositDTO> getFixedDeposit(@PathVariable Long id) {
        FixedDepositDTO deposit = fixedDepositService.getFixedDepositById(id);
        return ResponseEntity.ok(deposit);
    }
} 