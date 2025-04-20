package com.bank.service;

import com.bank.model.Customer;
import java.util.List;
import java.util.Optional;

public interface CustomerService {
    Customer createCustomer(Customer customer);
    Optional<Customer> getCustomerById(Long id);
    Optional<Customer> getCustomerByEmail(String email);
    List<Customer> getAllCustomers();
    Customer updateCustomer(Long id, Customer customer);
    void deleteCustomer(Long id);
    Customer assignAccountNumber(Long customerId, String accountNumber);
    boolean validateAccountNumber(String accountNumber);
    Customer getCustomerByAccountNumber(String accountNumber);
    List<Customer> getCustomersByKycStatus(String status);
} 