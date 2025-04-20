# Bank Management System

A full-stack banking application with user and admin functionalities, built using Spring Boot and React.

## Features

### User Features
- Login as User
- Import Account by Account Number
- Request Loan
- Create Fixed Deposit
- Fund Transfer between Accounts
- View Transaction History

### Admin Features
- Admin Dashboard Access
- Create Account (KYC Form)
- Deposit to Any Account
- Approve/Reject Loan Requests
- View All Fixed Deposits

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.1.0
- Spring Data JPA
- MySQL Database

### Frontend
- React
- Material-UI
- Axios for API calls

## Project Structure

### Backend
```
backend/
├── src/main/java/com/example/bank/
│   ├── controller/    # REST API endpoints
│   ├── service/      # Business logic
│   ├── repository/   # Data access layer
│   ├── model/        # Entity classes
│   └── dto/          # Data Transfer Objects
```

### Frontend
```
frontend/
├── src/
│   ├── components/   # React components
│   ├── services/     # API services
│   ├── context/      # React context
│   └── utils/        # Utility functions
```

## Setup Instructions

### Backend Setup
1. Create MySQL database:
   ```sql
   CREATE DATABASE bank_management;
   ```

2. Update database configuration in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bank_management
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Run the Spring Boot application:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the React application:
   ```bash
   npm start
   ```

## API Endpoints

### User APIs
- POST `/api/users/login` - User login
- POST `/api/users/register` - User registration
- GET `/api/users/{id}` - Get user details

### Account APIs
- POST `/api/accounts` - Create account
- GET `/api/accounts/{accountNumber}` - Get account details
- POST `/api/accounts/deposit` - Deposit money
- POST `/api/accounts/transfer` - Transfer money

### Loan APIs
- POST `/api/loans/request` - Request loan
- POST `/api/loans/{loanId}/approve` - Approve loan
- POST `/api/loans/{loanId}/reject` - Reject loan
- GET `/api/loans/user/{userId}` - Get user loans
- GET `/api/loans/status/{status}` - Get loans by status

### Fixed Deposit APIs
- POST `/api/fixed-deposits` - Create fixed deposit
- GET `/api/fixed-deposits/user/{userId}` - Get user fixed deposits
- GET `/api/fixed-deposits` - Get all fixed deposits

## Design Principles Used

1. **SOLID Principles**
   - Single Responsibility Principle: Each class has one responsibility
   - Open/Closed Principle: Classes are open for extension but closed for modification
   - Liskov Substitution Principle: Objects are replaceable with instances of their subtypes
   - Interface Segregation: Specific interfaces are better than one general-purpose interface
   - Dependency Inversion: High-level modules don't depend on low-level modules

2. **MVC Pattern**
   - Model: Entity classes and repositories
   - View: React frontend
   - Controller: REST controllers

3. **GRASP Principles**
   - Information Expert: Classes that have the information to fulfill responsibilities
   - Creator: Classes responsible for creating instances of other classes
   - Controller: Objects handling system events
   - Low Coupling: Minimal dependencies between classes
   - High Cohesion: Related functionality grouped together 