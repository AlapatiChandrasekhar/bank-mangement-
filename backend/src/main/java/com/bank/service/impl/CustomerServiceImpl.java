package com.bank.service.impl;

import com.bank.model.Customer;
import com.bank.repository.CustomerRepository;
import com.bank.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setFirstName(customerDetails.getFirstName());
        customer.setLastName(customerDetails.getLastName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhoneNumber(customerDetails.getPhoneNumber());
        customer.setAddress(customerDetails.getAddress());
        customer.setAadharNumber(customerDetails.getAadharNumber());
        customer.setPanNumber(customerDetails.getPanNumber());
        customer.setDateOfBirth(customerDetails.getDateOfBirth());
        customer.setGender(customerDetails.getGender());
        customer.setOccupation(customerDetails.getOccupation());
        customer.setAnnualIncome(customerDetails.getAnnualIncome());

        return customerRepository.save(customer);
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customerRepository.delete(customer);
    }

    @Override
    @Transactional
    public Customer assignAccountNumber(Long customerId, String accountNumber) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        if (customerRepository.existsByAccountNumber(accountNumber)) {
            throw new RuntimeException("Account number already exists");
        }
        
        customer.setAccountNumber(accountNumber);
        return customerRepository.save(customer);
    }

    @Override
    public boolean validateAccountNumber(String accountNumber) {
        return customerRepository.existsByAccountNumber(accountNumber);
    }

    @Override
    public Customer getCustomerByAccountNumber(String accountNumber) {
        return customerRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Customer not found with account number: " + accountNumber));
    }

    @Override
    public List<Customer> getCustomersByKycStatus(String status) {
        // Implement KYC status filtering logic
        return customerRepository.findAll(); // Placeholder - implement actual KYC status filtering
    }
} 