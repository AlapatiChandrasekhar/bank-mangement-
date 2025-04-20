package com.example.bank.service;

import com.example.bank.dto.UserDTO;
import com.example.bank.dto.LoginRequest;
import java.util.List;

public interface UserService {
    UserDTO login(LoginRequest loginRequest);
    UserDTO createUser(String username, String password, String role);
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    void deleteUser(Long id);
} 