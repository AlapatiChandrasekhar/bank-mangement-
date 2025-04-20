package com.bank.controller;

import com.bank.model.Customer;
import com.bank.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Customer customer) {
        try {
            // Validate required fields
            if (customer.getEmail() == null || customer.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
            }
            if (customer.getPassword() == null || customer.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
            }
            
            // Check if email already exists
            if (customerService.getCustomerByEmail(customer.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
            }

            // Set default values
            customer.setAdmin(false);
            
            // Create customer
            Customer savedCustomer = customerService.createCustomer(customer);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedCustomer.getId());
            response.put("email", savedCustomer.getEmail());
            response.put("message", "Registration successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
            }
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
            }

            Customer customer = customerService.getCustomerByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));
            
            // Validate password
            if (!customer.getPassword().equals(loginRequest.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }
            
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password"));
        }
    }
}

class LoginRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
} 