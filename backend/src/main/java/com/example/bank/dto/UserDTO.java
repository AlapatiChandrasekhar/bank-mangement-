package com.example.bank.dto;

import com.example.bank.model.UserRole;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private UserRole role;
} 