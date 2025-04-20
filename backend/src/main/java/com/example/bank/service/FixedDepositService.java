package com.example.bank.service;

import com.example.bank.dto.FixedDepositDTO;
import java.util.List;

public interface FixedDepositService {
    FixedDepositDTO createFixedDeposit(Long userId, Double amount, Double interestRate, String maturityDate);
    List<FixedDepositDTO> getFixedDepositsByUserId(Long userId);
    List<FixedDepositDTO> getAllFixedDeposits();
    FixedDepositDTO getFixedDepositById(Long id);
}
 